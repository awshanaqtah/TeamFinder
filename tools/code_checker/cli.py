"""CLI entry-point for the code quality checker."""

from __future__ import annotations

import argparse
import json
import sys
from datetime import datetime
from pathlib import Path
from typing import List

from .reporter import Reporter
from .runner import CheckResult, run_check, run_fix


# ── report serialisation ──────────────────────────────────────────────────────


def _result_to_dict(result: CheckResult) -> dict:
    return {
        "generated_at": datetime.now().isoformat(),
        "files_checked": result.files_checked,
        "score": result.score,
        "totals": {
            "errors": len(result.errors),
            "warnings": len(result.warnings),
            "conventions": len(result.conventions),
            "total": len(result.issues),
        },
        "issues": [
            {
                "severity": i.severity,
                "filename": i.filename,
                "row": i.row,
                "col": i.col,
                "code": i.code,
                "message": i.message,
                "fixable": i.fixable,
            }
            for i in result.issues
        ],
    }


def _save_report(result: CheckResult, path: str) -> None:
    out = Path(path)
    data = _result_to_dict(result)

    if out.suffix.lower() == ".json":
        out.write_text(json.dumps(data, indent=2), encoding="utf-8")
    else:
        # Plain-text report
        lines: List[str] = [
            "=" * 60,
            "  Code Quality Report",
            f"  Generated: {data['generated_at']}",
            "=" * 60,
            f"  Files checked : {data['files_checked']}",
            f"  Score         : {data['score']:.2f} / 10.00",
            f"  Errors        : {data['totals']['errors']}",
            f"  Warnings      : {data['totals']['warnings']}",
            f"  Conventions   : {data['totals']['conventions']}",
            "",
        ]

        for sev in ("error", "warning", "convention"):
            group = [i for i in data["issues"] if i["severity"] == sev]
            if not group:
                continue
            lines.append("-" * 60)
            lines.append(f"  {sev.upper()}S ({len(group)})")
            lines.append("-" * 60)
            for i in group:
                fix = "  [fixable]" if i["fixable"] else ""
                lines.append(
                    f"  {i['filename']}:{i['row']}:{i['col']}  "
                    f"[{i['code']}]  {i['message']}{fix}"
                )
            lines.append("")

        out.write_text("\n".join(lines), encoding="utf-8")

    print(f"  Report saved → {out.resolve()}")


# ── argument parser ───────────────────────────────────────────────────────────


def _build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(
        prog="code_checker",
        description="Python code quality checker powered by Ruff.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
examples:
  python -m code_checker myfile.py
  python -m code_checker src/
  python -m code_checker src/ --fix
  python -m code_checker src/ --report report.json
  python -m code_checker src/ --report report.txt --no-color
""",
    )
    p.add_argument(
        "targets",
        nargs="+",
        metavar="PATH",
        help="Python file(s) or folder(s) to check.",
    )
    p.add_argument(
        "--fix",
        action="store_true",
        help="Auto-fix safe issues and format the code with ruff.",
    )
    p.add_argument(
        "--report",
        metavar="FILE",
        help="Save a report to FILE (.txt or .json).",
    )
    p.add_argument(
        "--no-color",
        action="store_true",
        help="Disable ANSI colour output.",
    )
    p.add_argument(
        "--select",
        metavar="RULES",
        default="ALL",
        help=(
            "Comma-separated Ruff rule prefixes to enable "
            "(default: ALL).  Example: E,W,F"
        ),
    )
    return p


# ── main ──────────────────────────────────────────────────────────────────────


def main(argv: List[str] | None = None) -> int:
    parser = _build_parser()
    args = parser.parse_args(argv)

    reporter = Reporter(use_color=not args.no_color)

    # Validate targets exist
    missing = [t for t in args.targets if not Path(t).exists()]
    if missing:
        for m in missing:
            print(f"error: path not found: {m}", file=sys.stderr)
        return 2

    if args.fix:
        print("\n  Running auto-fix…")
        fixed = run_fix(args.targets)
        if fixed:
            print(f"  ✔  Fixed {fixed} issue(s).\n")
        else:
            print("  No auto-fixable issues found.\n")

    result: CheckResult = run_check(args.targets, select=args.select)
    reporter.print_results(result)

    if args.report:
        if result.ruff_available and not result.error_message:
            _save_report(result, args.report)
        else:
            print("  Skipping report — linter did not produce results.", file=sys.stderr)

    # Exit code: 1 if any issues, 0 if clean
    return 1 if result.issues else 0
