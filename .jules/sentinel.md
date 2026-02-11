# Sentinel Journal - Billiards Security

## 2025-02-11 - Preventing XSS via innerHTML and Insecure Redirects
**Vulnerability:** XSS via `innerHTML` and `location.href` injection.
**Learning:** Using `textContent` and `createElement` effectively neutralizes HTML injection. However, even when using safe DOM APIs, assigning unsanitized user-provided strings to `location.href` or `setAttribute('href', ...)` can still lead to XSS via `javascript:`, `data:`, or `vbscript:` protocols.
**Prevention:**
1. Replace all `innerHTML` sinks with `textContent` or structured DOM construction.
2. Implement a strict protocol check (whitelist or blocklist) for any URL before assignment to `href`. Normalize URLs by trimming and converting to lowercase before checking prefixes.
3. Move interaction logic (like redirects) into dedicated methods (e.g., `handleHref`) to facilitate easier unit testing and spying in JSDOM environments where `globalThis.location` is protected.
4. Avoid committing build artifacts (`dist/`) that might be regenerated during the fix process.
5. Use structured data (e.g., `ButtonConfig` objects) instead of HTML strings for passing dynamic UI actions between modules.
