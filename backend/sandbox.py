"""
Code Evaluation Sandbox
------------------------
Runs LLM-generated code against a problem's hidden test cases and
scores correctness. This matches your proposal's "Code Evaluation
Sandbox" module.

IMPORTANT - prototype vs production:
This version runs code in a separate OS *process* with a timeout,
which is fine for an FYP demo on your own machine. It is NOT safe to
expose to the public internet, because a process can still touch the
filesystem/network. For your Semester 8 production version, replace
`run_in_subprocess()` with real Docker container isolation (see
docker_sandbox_notes.md in this folder for how to do that).
"""

import ast
import subprocess
import sys
import tempfile
import textwrap
import os


class SandboxResult:
    def __init__(self, passed, total, details, error=None):
        self.passed = passed
        self.total = total
        self.details = details
        self.error = error

    def to_dict(self):
        return {
            "passed": self.passed,
            "total": self.total,
            "success": self.passed == self.total and self.error is None,
            "details": self.details,
            "error": self.error,
        }


def _is_safe(code: str) -> bool:
    """Very basic static check - blocks obviously dangerous imports.
    This is NOT a substitute for real sandboxing (Docker) - just a
    first filter so the prototype doesn't immediately break itself."""
    banned = ["import os", "import sys", "import subprocess", "open(", "__import__", "eval(", "exec("]
    return not any(b in code for b in banned)


def run_in_subprocess(code: str, function_name: str, test_input: str, timeout=5):
    """Runs `code` in a fresh Python process, calls function_name(test_input),
    and returns whatever it prints to stdout."""
    # Build the harness by concatenation, NOT by embedding `code` inside
    # an indented f-string block - code may already contain its own
    # indentation (e.g. "def solve(x):\n    return x"), and mixing that
    # with textwrap.dedent() on the surrounding template corrupts it.
    driver = (
        f'\nif __name__ == "__main__":\n'
        f"    result = {function_name}({test_input})\n"
        f"    print(result)\n"
    )
    harness = code.rstrip() + "\n" + driver

    with tempfile.NamedTemporaryFile(mode="w", suffix=".py", delete=False) as f:
        f.write(harness)
        tmp_path = f.name

    try:
        proc = subprocess.run(
            [sys.executable, tmp_path],
            capture_output=True,
            text=True,
            timeout=timeout,
        )
        if proc.returncode != 0:
            return None, proc.stderr.strip()
        return proc.stdout.strip(), None
    except subprocess.TimeoutExpired:
        return None, "Execution timed out"
    finally:
        os.unlink(tmp_path)


def evaluate(code: str, function_name: str, hidden_tests: list) -> SandboxResult:
    if not _is_safe(code):
        return SandboxResult(0, len(hidden_tests), [], error="Generated code contains disallowed operations.")

    try:
        ast.parse(code)  # syntax check before we even run it
    except SyntaxError as e:
        return SandboxResult(0, len(hidden_tests), [], error=f"Syntax error: {e}")

    details = []
    passed = 0

    for test in hidden_tests:
        actual, err = run_in_subprocess(code, function_name, test["input"])
        expected = test["output"]
        ok = (err is None) and (actual == expected)
        if ok:
            passed += 1
        details.append({
            "input": test["input"],
            "expected": expected,
            "actual": actual,
            "error": err,
            "passed": ok,
        })

    return SandboxResult(passed, len(hidden_tests), details)
