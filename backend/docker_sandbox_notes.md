# Upgrading the sandbox to real Docker isolation (Semester 8)

Right now `sandbox.py` runs generated code in a plain Python subprocess
with a timeout. That's fine for your own machine during development,
but it is NOT safe once this is a real deployed platform, because the
generated code still shares your OS/filesystem.

When you're ready to harden it:

1. Build a minimal Docker image with just Python and no network access:
   ```
   FROM python:3.11-slim
   RUN useradd -m sandboxuser
   USER sandboxuser
   ```

2. Instead of `subprocess.run([sys.executable, tmp_path], ...)`, run:
   ```
   docker run --rm \
     --network none \
     --memory 128m \
     --cpus 0.5 \
     --pids-limit 64 \
     -v {tmp_path}:/app/code.py:ro \
     eduprompt-sandbox python /app/code.py
   ```

3. Consider using an existing open-source runner instead of hand-rolling
   this — Judge0 (https://github.com/judge0/judge0) is exactly the
   "Judge0-style" sandbox referenced in your D1 Tech Stack section, and
   handles multi-language execution, resource limits, and isolation
   for you.
