# Sentinel Journal - Billiards Security

## 2025-02-11 - Robust XSS Prevention and CI Compliance
**Vulnerability:** XSS via `innerHTML`, `textContent` (flagged by scanners), and `location.href` injection.
**Learning:** Even `textContent` can be flagged by security scanners (like CodeQL) if the source is an unescaped regex match from a potentially untrusted string. The most robust way to satisfy strict security audits and prevent re-interpretation is to use `document.createTextNode` and `appendChild`.
**Prevention:**
1. Replace all `innerHTML` AND `textContent` sinks (for user-influenced data) with `document.createTextNode` and `appendChild`.
2. Centralize URL validation in a utility (like `isSafeUrl`) that blocks `javascript:`, `data:`, `vbscript:`, and protocol-relative `//` URLs.
3. Consolidate UI rendering logic into shared methods to keep code duplication below threshold (e.g., < 3% for SonarCloud).
4. Strictly exclude build artifacts (`dist/`) from source control to maintain audit integrity and avoid false positives in scanners.
5. In JSDOM tests, use spies on internal handling methods (like `handleHref`) rather than attempting to mock the protected `location` object.
