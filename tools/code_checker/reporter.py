"""Terminal reporter: colour-coded output grouped by severity."""

from __future__ import annotations

import os
from typing import List

from .runner import CheckResult, Issue

# ── ANSI colour helpers ────────────────────────────────────────────────────────

RESET = "\033[0m"
BOLD = "\033[1m"
DIM = "\033[2m"

RED = "\033[91m"
YELLOW = "\033[93m"
BLUE = "\033[94m"
CYAN = "\033[96m"
GREEN = "\033[92m"
WHITE = "\033[97m"


def _supports_color() -> bool:
    """Return True when the terminal likely supports ANSI escape codes."""
    if os.environ.get("NO_COLOR"):
        return False
    if os.environ.get("FORCE_COLOR"):
        return True
    return hasattr(os, "get_terminal_size") and os.isatty(1)


class Reporter:
    def __init__(self, use_color: bool | None = None) -> None:
        self.color = _supports_color() if use_color is None else use_color

    # ── private formatting helpers ────────────────────────────────────────────

    def _c(self, text: str, *codes: str) -> str:
        if not self.color:
            return text
        return "".join(codes) + text + RESET

    def _header(self, text: str) -> str:
        return self._c(text, BOLD, WHITE)

    def _error(self, text: str) -> str:
        return self._c(text, RED)

    def _warning(self, text: str) -> str:
        return self._c(text, YELLOW)

    def _convention(self, text: str) -> str:
        return self._c(text, BLUE)

    def _good(self, text: str) -> str:
        return self._c(text, GREEN)

    def _dim(self, text: str) -> str:
        return self._c(text, DIM)

    def _bold(self, text: str) -> str:
        return self._c(text, BOLD)

    # ── issue rendering ───────────────────────────────────────────────────────

    def _format_issue(self, issue: Issue) -> str:
        loc = self._dim(f"{issue.filename}:{issue.row}:{issue.col}")
        code = f"[{issue.code}]"
        fixable = self._dim(" ✓ fixable") if issue.fixable else ""

        if issue.severity == "error":
            code_str = self._error(code)
        elif issue.severity == "warning":
            code_str = self._warning(code)
        else:
            code_str = self._convention(code)

        return f"  {loc}  {code_str}  {issue.message}{fixable}"

    def _section(self, label: str, issues: List[Issue], color_fn) -> None:
        if not issues:
            return
        print(self._bold(color_fn(f"\n{'─' * 60}")))
        print(self._bold(color_fn(f"  {label}  ({len(issues)})")))
        print(self._bold(color_fn(f"{'─' * 60}")))
        for issue in issues:
            print(self._format_issue(issue))

    # ── public interface ──────────────────────────────────────────────────────

    def print_results(self, result: CheckResult) -> None:
        if not result.ruff_available:
            print(self._error(f"\n✗  {result.error_message}"))
            return

        if result.error_message:
            print(self._error(f"\n✗  {result.error_message}"))
            return

        print(
            self._header(f"\n{'═' * 60}")
        )
        print(
            self._header(f"  TeamFinder Code Quality Checker")
        )
        print(
            self._header(f"{'═' * 60}")
        )
        print(
            self._dim(f"  Files checked: {result.files_checked}")
        )

        if not result.issues:
            print(self._good("\n  ✔  No issues found — your code is clean!\n"))
            self._print_score(result)
            return

        self._section("ERRORS", result.errors, self._error)
        self._section("WARNINGS", result.warnings, self._warning)
        self._section("CONVENTIONS", result.conventions, self._convention)

        self._print_score(result)

    def _print_score(self, result: CheckResult) -> None:
        score = result.score
        print(self._bold(f"\n{'═' * 60}"))
        print(self._bold("  SUMMARY"))
        print(self._bold(f"{'═' * 60}"))

        total = len(result.issues)
        if total:
            print(f"  Total issues : {total}")
            print(f"  Errors       : {self._error(str(len(result.errors)))}")
            print(f"  Warnings     : {self._warning(str(len(result.warnings)))}")
            print(f"  Conventions  : {self._convention(str(len(result.conventions)))}")
            fixable = sum(1 for i in result.issues if i.fixable)
            if fixable:
                print(
                    f"  Auto-fixable : {self._dim(str(fixable))} "
                    + self._dim("(run with --fix)")
                )

        # Colour the score
        if score >= 8.0:
            score_str = self._good(f"{score:.2f} / 10.00")
        elif score >= 5.0:
            score_str = self._warning(f"{score:.2f} / 10.00")
        else:
            score_str = self._error(f"{score:.2f} / 10.00")

        print(f"\n  Score : {self._bold(score_str)}")
        print(self._bold(f"{'═' * 60}\n"))
