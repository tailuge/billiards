## 2025-05-14 - [XSS in Chat and Notifications]
**Vulnerability:** Cross-Site Scripting (XSS) via `innerHTML` usage in chat and notification systems.
**Learning:** Using `innerHTML` for displaying user-controlled messages (like chat or broadcasted game events) is a major security risk. Even local UI elements like `offerUpload` were vulnerable via `location.search` injection into attributes.
**Prevention:** Prefer `textContent` for plain text messages. For trusted HTML, use an explicit `showHTML` method and carefully sanitize dynamic parts (e.g., using `URLSearchParams` for URLs or an `escapeHTML` helper for text interpolated into templates).
