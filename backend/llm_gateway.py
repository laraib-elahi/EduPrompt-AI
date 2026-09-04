"""
LLM Gateway
-----------
Sends a student's natural-language prompt to an LLM API and returns
the generated Python code. This is the module described in your
proposal's "System Overview" -> LLM Gateway.

For the prototype stage, this supports two modes:
  1. LIVE mode - calls Anthropic's API if ANTHROPIC_API_KEY is set in .env
  2. STUB mode - if no API key is set, returns a canned response so the
     rest of the pipeline (sandbox, scoring, UI) can be built and demoed
     without needing an API key yet.

Swap in OpenAI / any other provider here later if needed - this is the
ONLY file that should need to change.
"""

import os
import re

USE_STUB = os.getenv("ANTHROPIC_API_KEY") is None


def _extract_code(text: str) -> str:
    """Pull code out of a ```python ... ``` fenced block if present."""
    match = re.search(r"```(?:python)?\s*(.*?)```", text, re.DOTALL)
    if match:
        return match.group(1).strip()
    return text.strip()


def generate_code(student_prompt: str, problem_description: str, examples: list) -> str:
    """
    Sends the student's prompt (plus problem context) to the LLM and
    returns generated Python code as a string.
    """
    if USE_STUB:
        return _stub_generate(student_prompt, problem_description)

    import anthropic  # pip install anthropic

    client = anthropic.Anthropic()  # reads ANTHROPIC_API_KEY from env

    examples_text = "\n".join(
        f"Input: {ex['input']} -> Output: {ex['output']}" for ex in examples
    )

    system_prompt = (
        "You are a code-generation backend for a student learning platform. "
        "A student is trying to write a prompt that gets you to generate correct code "
        "for a hidden problem, shown to them ONLY as input/output examples. "
        "Given their prompt and the example input/output pairs, generate ONLY a single "
        "Python function that satisfies the pattern. Return the code inside a "
        "```python fenced block, nothing else."
    )

    user_message = (
        f"Student's prompt:\n{student_prompt}\n\n"
        f"Known input/output examples for this problem:\n{examples_text}\n\n"
        f"(Internal context, not shown to student: {problem_description})"
    )

    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=500,
        system=system_prompt,
        messages=[{"role": "user", "content": user_message}],
    )

    raw_text = "".join(
        block.text for block in response.content if block.type == "text"
    )
    return _extract_code(raw_text)


def _stub_generate(student_prompt: str, problem_description: str) -> str:
    """
    Fallback used when no API key is configured yet. Lets the team build
    and demo the full pipeline (frontend -> backend -> sandbox -> result)
    before wiring up real LLM calls.
    """
    return (
        "def solve(x):\n"
        "    # STUB response - no ANTHROPIC_API_KEY set in backend/.env\n"
        "    # Replace this once your LLM Gateway is connected.\n"
        "    return x\n"
    )
