import os
import time
from playwright.sync_api import sync_playwright

def verify_notifications():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        dist_path = os.path.abspath("dist/index.html")
        page = browser.new_page()
        page.goto(f"file://{dist_path}")
        time.sleep(2)
        page.evaluate("""
            const notification = document.getElementById('notification');
            notification.innerHTML = `
                <div class="notification-banner">
                    <button class="notification-close" aria-label="Dismiss notification" data-notification-action="clear">×</button>
                    <div class="notification-content-wrapper">
                        <div class="notification-main">
                            <div class="notification-icon">🏆</div>
                            <div class="notification-text-group">
                                <div class="notification-title">Victory!</div>
                                <div class="notification-subtext">You cleared the table in 5 shots.</div>
                            </div>
                        </div>
                        <div class="notification-match-score">
                            <div class="match-score-container">
                                <div class="match-score-label">MATCH SCORE</div>
                                <div class="match-score-value">1 - 0</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="notification-extra">
                    <button data-notification-action="rematch">REMATCH</button>
                    <button data-notification-action="lobby">LOBBY</button>
                </div>
            `;
            notification.className = 'type-GameOver is-winner';
            notification.style.display = 'flex';
        """)
        time.sleep(1)
        page.locator("#notification").screenshot(path="verification/winner_notification.png")
        browser.close()

if __name__ == "__main__":
    verify_notifications()
