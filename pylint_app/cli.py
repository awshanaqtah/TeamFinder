"""CLI entry point for the pylint application."""

from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Sequence

from .runner import LintResult, run_pylint


def _build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="pylint-app",
        description="Run pylint programmatically and print a compact report.",
    )
    parser.add_argument(
        "targets",
        nargs="+",
        help="Files, directories, or Python modules to lint.",
    )
    parser.add_argument(
        "--disable",
        default=None,
        help="Comma-separated pylint rules to disable (example: C0114,C0116).",
    )
    parser.add_argument(
        "--enable",
        default=None,
        help="Comma-separated pylint rules to enable.",
    )
    parser.add_argument(
        "--min-score",
        type=float,
        default=None,
        help="Fail if score is below this value.",
    )
    parser.add_argument(
        "--max-messages",
        type=int,
        default=20,
        help="Maximum number of findings to print.",
    )
    parser.add_argument(
        "--json-out",
        default=None,
        help="Optional path to save full JSON report.",
    )
    return parser


def _print_summary(result: LintResult, max_messages: int) -> None:
    counts = result.message_counts
    print(f"Score: {result.score:.2f}/10")
    print(f"Files checked: {len(result.files_checked)}")
    print(
        "Findings: "
        f"fatal={counts['fatal']} "
        f"error={counts['error']} "
        f"warning={counts['warning']} "
        f"refactor={counts['refactor']} "
        f"convention={counts['convention']} "
        f"info={counts['info']}"
    )

    if not result.messages:
        print("No findings.")
        return

    print("")
    print("Top findings:")
    for msg in result.messages[:max_messages]:
        print(
            f"- {msg.path}:{msg.line}:{msg.column} "
            f"[{msg.message_id}/{msg.symbol}] {msg.message}"
        )

    hidden = len(result.messages) - max_messages
    if hidden > 0:
        print(f"... and {hidden} more.")


def _write_json(result: LintResult, output_path: str) -> None:
    path = Path(output_path)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(result.to_dict(), indent=2), encoding="utf-8")
    print(f"JSON report written to: {path}")


def main(argv: Sequence[str] | None = None) -> int:
    """Run CLI application and return process exit code."""
    parser = _build_parser()
    args = parser.parse_args(argv)

    try:
        result = run_pylint(
            targets=args.targets,
            disable=args.disable,
            enable=args.enable,
        )
    except Exception as exc:  # pylint: disable=broad-exception-caught
        print(f"Failed to run pylint: {exc}")
        return 2

    _print_summary(result, max_messages=max(0, args.max_messages))

    if args.json_out:
        _write_json(result, args.json_out)

    has_blocking = result.message_counts["fatal"] > 0 or result.message_counts["error"] > 0
    if has_blocking:
        return 1

    if args.min_score is not None and result.score < args.min_score:
        return 1

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
