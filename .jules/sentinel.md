# Sentinel Journal - Billiards Security

## 2025-02-11 - Preventing XSS via innerHTML and Insecure Redirects
**Vulnerability:** XSS via `innerHTML` and `location.href` injection.
**Learning:** Using `textContent` and `createElement` effectively neutralizes HTML injection. However, even when using safe DOM APIs, assigning unsanitized user-provided strings to `location.href` or `setAttribute('href', ...)` can still lead to XSS via `javascript:`, `data:`, or `vbscript:` protocols. Protocol-relative URLs (`//`) can also be used to bypass simple prefix checks and redirect to malicious domains.
**Prevention:**
1. Replace all `innerHTML` sinks with `textContent` or structured DOM construction.
2. Implement a robust protocol check for any URL before assignment to `href`. Block `javascript:`, `data:`, `vbscript:`, and protocol-relative `//` URLs.
3. Use a centralized security utility for URL validation to ensure consistency and reduce duplication.
4. Move interaction logic (like redirects) into dedicated methods (e.g., `handleHref`) to facilitate easier unit testing and spying in JSDOM environments.
5. NEVER commit build artifacts (`dist/`) to the repository, especially when fixing security issues, to avoid audit risks and source-build mismatches.
6. Use structured data (e.g., `ButtonConfig` objects) instead of HTML strings for inter-component communication.
