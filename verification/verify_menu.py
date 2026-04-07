from playwright.sync_api import sync_playwright
import time
import os

def verify_menu():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Using file:// path to dist/index.html
        current_dir = os.getcwd()
        url = f"file://{current_dir}/dist/index.html"
        page.goto(url)

        # Wait for the menu to be available
        page.wait_for_selector(".outerMenu")

        # Force all menu buttons to be visible
        page.evaluate("""
            const buttons = document.querySelectorAll('.menuButton');
            buttons.forEach(btn => {
                btn.removeAttribute('hidden');
                btn.style.display = 'flex'; // Ensure flex as per CSS
            });
        """)

        # Take a screenshot of the menu container
        menu = page.locator(".outerMenu")
        menu.screenshot(path="verification/menu_verification.png")

        # Take a full page screenshot for context
        page.screenshot(path="verification/full_page.png")

        browser.close()

if __name__ == "__main__":
    verify_menu()
