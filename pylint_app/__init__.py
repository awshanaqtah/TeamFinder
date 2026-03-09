"""Pylint application package."""

from .runner import LintMessage, LintResult, run_pylint

__all__ = ["LintMessage", "LintResult", "run_pylint"]
