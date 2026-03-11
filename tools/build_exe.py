"""Build code_checker into a standalone .exe using PyInstaller."""

import shutil
import subprocess
import sys
from pathlib import Path

TOOLS_DIR = Path(__file__).resolve().parent
ENTRY_POINT = TOOLS_DIR / "entry_point.py"
DIST_DIR = TOOLS_DIR / "dist"


def main() -> int:
    # Find the ruff executable so we can bundle it
    ruff_path = shutil.which("ruff")
    if not ruff_path:
        print("ERROR: ruff not found on PATH.", file=sys.stderr)
        print("Install it first:  pip install ruff", file=sys.stderr)
        return 1

    ruff_path = Path(ruff_path).resolve()
    print(f"  Found ruff: {ruff_path}")

    # PyInstaller --add-data syntax: "source;destination" on Windows
    add_data = f"{ruff_path};."

    cmd = [
        sys.executable, "-m", "PyInstaller",
        "--onefile",
        "--name", "code_checker",
        "--distpath", str(DIST_DIR),
        "--workpath", str(TOOLS_DIR / "build"),
        "--specpath", str(TOOLS_DIR),
        "--add-data", add_data,
        "--hidden-import", "code_checker",
        "--hidden-import", "code_checker.cli",
        "--hidden-import", "code_checker.runner",
        "--hidden-import", "code_checker.reporter",
        str(ENTRY_POINT),
    ]

    print(f"\n  Running PyInstaller...\n")
    result = subprocess.run(cmd, cwd=str(TOOLS_DIR))

    if result.returncode != 0:
        print("\nERROR: PyInstaller failed.", file=sys.stderr)
        return 1

    exe_path = DIST_DIR / "code_checker.exe"
    if exe_path.exists():
        size_mb = exe_path.stat().st_size / (1024 * 1024)
        print(f"\n  SUCCESS: {exe_path}")
        print(f"  Size: {size_mb:.1f} MB")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
