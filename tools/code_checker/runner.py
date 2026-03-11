"""Run Ruff against target files/folders and parse the results."""

from __future__ import annotations

import json
import subprocess
import sys
from dataclasses import dataclass, field
from pathlib import Path
from typing import List, Optional


@dataclass
class Issue:
    filename: str
    row: int
    col: int
    code: str
    message: str
    fixable: bool

    @property
    def severity(self) -> str:
        """Classify issue by severity based on rule prefix."""
        prefix = self.code[:1] if self.code else ""
        two = self.code[:2] if len(self.code) >= 2 else prefix

        if prefix in ("E", "F") or two in ("S0", "S1", "S2", "S3", "S4", "S5", "S6", "S7"):
            return "error"
        if prefix in ("W", "B", "T", "UP", "RUF"[:1]) or two in ("RU",):
            return "warning"
        return "convention"


@dataclass
class CheckResult:
    issues: List[Issue] = field(default_factory=list)
    files_checked: int = 0
    fixed_count: int = 0
    ruff_available: bool = True
    error_message: Optional[str] = None

    @property
    def errors(self) -> List[Issue]:
        return [i for i in self.issues if i.severity == "error"]

    @property
    def warnings(self) -> List[Issue]:
        return [i for i in self.issues if i.severity == "warning"]

    @property
    def conventions(self) -> List[Issue]:
        return [i for i in self.issues if i.severity == "convention"]

    @property
    def score(self) -> float:
        """Score out of 10.0 — penalise errors most, conventions least."""
        penalty = (
            len(self.errors) * 0.5
            + len(self.warnings) * 0.2
            + len(self.conventions) * 0.05
        )
        return round(max(0.0, 10.0 - penalty), 2)


def _ruff_executable() -> str:
    """Return 'ruff' or raise if not found."""
    try:
        subprocess.run(
            ["ruff", "--version"],
            capture_output=True,
            check=True,
        )
        return "ruff"
    except (FileNotFoundError, subprocess.CalledProcessError):
        return ""


def _count_python_files(targets: List[str]) -> int:
    count = 0
    for t in targets:
        p = Path(t)
        if p.is_file() and p.suffix == ".py":
            count += 1
        elif p.is_dir():
            count += sum(1 for _ in p.rglob("*.py"))
    return count


def run_check(targets: List[str], select: str = "ALL") -> CheckResult:
    """
    Run `ruff check` against *targets* and return a :class:`CheckResult`.

    Parameters
    ----------
    targets:
        List of file or directory paths to lint.
    select:
        Comma-separated list of rule prefixes to enable (default ``"ALL"``).
    """
    exe = _ruff_executable()
    result = CheckResult()

    if not exe:
        result.ruff_available = False
        result.error_message = (
            "ruff not found. Install it with:  pip install ruff"
        )
        return result

    result.files_checked = _count_python_files(targets)

    cmd = [
        exe, "check",
        "--output-format", "json",
        "--select", select,
        "--",
        *targets,
    ]

    proc = subprocess.run(cmd, capture_output=True, text=True)

    # ruff exits 1 when issues are found — that is not an error for us.
    if proc.returncode not in (0, 1):
        result.error_message = proc.stderr.strip() or "ruff exited unexpectedly."
        return result

    raw = proc.stdout.strip()
    if not raw:
        return result

    try:
        data = json.loads(raw)
    except json.JSONDecodeError:
        result.error_message = f"Could not parse ruff output:\n{raw[:500]}"
        return result

    for item in data:
        location = item.get("location", {})
        fix = item.get("fix") or {}
        result.issues.append(
            Issue(
                filename=item.get("filename", "?"),
                row=location.get("row", 0),
                col=location.get("column", 0),
                code=item.get("code", "?"),
                message=item.get("message", ""),
                fixable=bool(fix.get("applicability") in ("safe", "suggested", "always")),
            )
        )

    return result


def run_fix(targets: List[str]) -> int:
    """
    Run `ruff check --fix` and `ruff format` against *targets*.

    Returns the number of fixes applied (best-effort estimate from output).
    """
    exe = _ruff_executable()
    if not exe:
        print("ruff not found. Install it with:  pip install ruff", file=sys.stderr)
        return 0

    # Count issues before fixing so we can report how many were resolved.
    before = run_check(targets)
    fixable_before = sum(1 for i in before.issues if i.fixable)

    subprocess.run(
        [exe, "check", "--fix", "--", *targets],
        capture_output=True,
    )
    subprocess.run(
        [exe, "format", "--", *targets],
        capture_output=True,
    )

    after = run_check(targets)
    fixed = max(0, len(before.issues) - len(after.issues))
    return fixed
