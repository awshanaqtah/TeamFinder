"""PyInstaller entry point for code_checker."""

import sys
import io

# Ensure stdout/stderr use UTF-8 so Unicode box-drawing characters work on Windows.
if sys.stdout.encoding != "utf-8":
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
if sys.stderr.encoding != "utf-8":
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")

from code_checker.cli import main

raise SystemExit(main())
