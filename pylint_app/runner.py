"""Programmatic wrapper around pylint."""

from __future__ import annotations

from dataclasses import asdict, dataclass
import json
from io import StringIO
from pathlib import Path
from typing import Any

from pylint.lint import Run
from pylint.reporters.json_reporter import JSONReporter


@dataclass(frozen=True)
class LintMessage:
    """Single lint finding."""

    path: str
    line: int
    column: int
    severity: str
    symbol: str
    message_id: str
    message: str

    def to_dict(self) -> dict[str, Any]:
        """Serialize message to a plain dictionary."""
        return asdict(self)


@dataclass(frozen=True)
class LintResult:
    """Aggregated lint result."""

    score: float
    files_checked: list[str]
    message_counts: dict[str, int]
    messages: list[LintMessage]

    def to_dict(self) -> dict[str, Any]:
        """Serialize full result to a plain dictionary."""
        return {
            "score": self.score,
            "files_checked": self.files_checked,
            "message_counts": self.message_counts,
            "messages": [m.to_dict() for m in self.messages],
        }


def _split_csv(value: str | None) -> list[str]:
    if not value:
        return []
    return [item.strip() for item in value.split(",") if item.strip()]


def _build_args(targets: list[str], disable: str | None, enable: str | None) -> list[str]:
    args = list(targets)
    args.extend(["--score=y", "--persistent=n"])

    disabled = _split_csv(disable)
    enabled = _split_csv(enable)

    if disabled:
        args.append(f"--disable={','.join(disabled)}")
    if enabled:
        args.append(f"--enable={','.join(enabled)}")

    return args


def _parse_payload(payload: list[dict[str, Any]]) -> tuple[set[str], list[LintMessage]]:
    files: set[str] = set()
    messages: list[LintMessage] = []
    for item in payload:
        path = item.get("path", "")
        files.add(path)
        messages.append(
            LintMessage(
                path=path,
                line=int(item.get("line", 0) or 0),
                column=int(item.get("column", 0) or 0),
                severity=str(item.get("type", "info")),
                symbol=str(item.get("symbol", "")),
                message_id=str(item.get("message-id", "")),
                message=str(item.get("message", "")),
            )
        )
    return files, messages


def _message_counts(messages: list[LintMessage]) -> dict[str, int]:
    counts = {"fatal": 0, "error": 0, "warning": 0, "refactor": 0, "convention": 0, "info": 0}
    for msg in messages:
        if msg.severity in counts:
            counts[msg.severity] += 1
    return counts


def _expand_python_files(targets: list[str]) -> set[str]:
    files: set[str] = set()
    for target in targets:
        path = Path(target)
        if not path.exists():
            continue
        if path.is_file():
            files.add(str(path))
            continue
        files.update(str(file) for file in path.rglob("*.py"))
    return files


def run_pylint(
    targets: list[str],
    disable: str | None = None,
    enable: str | None = None,
) -> LintResult:
    """Run pylint and return parsed results."""

    if not targets:
        raise ValueError("At least one target path/module is required.")

    output = StringIO()
    reporter = JSONReporter(output=output)
    results = Run(_build_args(targets, disable, enable), reporter=reporter, exit=False)

    raw = output.getvalue().strip()
    try:
        payload = json.loads(raw) if raw else []
    except json.JSONDecodeError:
        payload = []

    files, messages = _parse_payload(payload)

    score = float(getattr(results.linter.stats, "global_note", 0.0) or 0.0)
    if not files:
        files.update(_expand_python_files(targets))
    if not files:
        files.update(targets)

    return LintResult(
        score=score,
        files_checked=sorted(files),
        message_counts=_message_counts(messages),
        messages=messages,
    )
