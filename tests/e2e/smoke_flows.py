"""End-to-end smoke test for the local stack.

Run with the stack up (`make dev`):
    python tests/e2e/smoke_flows.py

It needs Python with the `playwright` package and a Chromium build (`playwright install chromium`).
In development the API prints sign-in codes to its console, so the test reads the code from the
API container's logs, the same way a developer would read it from the inbox.
"""

import os
import re
import subprocess
import sys
import time
import uuid

from playwright.sync_api import sync_playwright

BASE = os.environ.get("BASE_URL", "http://localhost:3000")
REPO = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
failures = []


def check(label, ok):
    print(("PASS" if ok else "FAIL"), label)
    if not ok:
        failures.append(label)


def latest_sign_in_code(email):
    deadline = time.time() + 20
    while time.time() < deadline:
        logs = subprocess.run(
            ["docker", "compose", "logs", "api", "--tail", "400"],
            cwd=REPO, capture_output=True, text=True,
        ).stdout
        matches = re.findall(r"sign-in code is (\d{6})", logs)
        if matches and email in logs:
            return matches[-1]
        time.sleep(1)
    raise RuntimeError("No sign-in code found in the API log")


def main():
    email = f"e2e-{uuid.uuid4().hex[:8]}@example.com"
    with sync_playwright() as p:
        browser = p.chromium.launch()
        context = browser.new_context(viewport={"width": 1280, "height": 900}, reduced_motion="reduce")
        page = context.new_page()
        page_errors = []
        page.on("pageerror", lambda e: page_errors.append(str(e)[:160]))

        # 1. Browsing needs no account.
        page.goto(BASE + "/", wait_until="load", timeout=60000)
        page.wait_for_timeout(3000)
        text = page.evaluate("document.body.innerText")
        check("home shows listings without signing in", page.locator('button[aria-label="Save to favourites"]').count() > 0)
        check("no invented claims on the home page", not any(x in text for x in ["10,000+", "#1 Real Estate", "Watch Demo"]))

        # 2. Saving asks for an account, then saves once the visitor signs in.
        page.locator('button[aria-label="Save to favourites"]').first.click()
        dialog = page.locator('[role="dialog"][aria-label="Sign in to continue"]')
        dialog.wait_for(timeout=10000)
        check("saving opens the sign-in prompt", dialog.count() == 1)

        dialog.locator('input[id="email"]').fill(email)
        dialog.get_by_role("button", name="Send me a code").click()
        dialog.locator('input[id="code"]').wait_for(timeout=15000)
        code = latest_sign_in_code(email)
        dialog.locator('input[id="code"]').fill(code)
        dialog.get_by_role("button", name="Continue").click()
        page.wait_for_timeout(3000)

        saved = page.evaluate(
            "fetch('/api/me/favourites', {headers: {Accept: 'application/json'}}).then(r => r.json()).then(d => d.count)"
        )
        check("the home is saved after signing in", saved == 1)
        check("the sign-in prompt closes", page.locator('[role="dialog"][aria-label="Sign in to continue"]').count() == 0)

        # 3. The session survives a reload, and the account menu replaces the Sign in button.
        page.reload(wait_until="load", timeout=60000)
        page.wait_for_timeout(3000)
        check("session persists across reloads", page.locator('button[aria-label="Account menu"]').count() == 1)

        # 4. The favourites page shows the saved home instead of the sign-in screen.
        page.goto(BASE + "/favorites", wait_until="load", timeout=60000)
        page.wait_for_timeout(3000)
        check("favourites page shows saved homes", "Sign in" not in page.evaluate("document.body.innerText")[:400])

        # 5. Sign-out revokes the session on the server.
        status = page.evaluate(
            "fetch('/api/auth/logout', {method: 'POST', headers: {'Content-Type': 'application/json', 'X-DH-Request': '1'}, body: '{}'}).then(r => r.status)"
        )
        check("sign-out succeeds", status == 204)
        after = page.evaluate("fetch('/api/auth/me', {headers: {Accept: 'application/json'}}).then(r => r.status)")
        check("after sign-out the session is gone", after == 401)

        check("no uncaught page errors", not page_errors)
        for err in page_errors[:5]:
            print("   ", err)
        browser.close()

    if failures:
        print(f"\n{len(failures)} check(s) failed")
        sys.exit(1)
    print("\nAll end-to-end checks passed")


if __name__ == "__main__":
    main()
