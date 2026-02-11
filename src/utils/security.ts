/**
 * Security utility functions for input sanitization and URL validation.
 */

/**
 * Checks if a URL is safe to be used in an href attribute.
 * Blocks dangerous protocols like javascript:, data:, and vbscript:.
 */
export function isSafeUrl(url: string): boolean {
  if (!url) return false;

  const trimmedUrl = url.trim();
  const lowerUrl = trimmedUrl.toLowerCase();

  // Block dangerous protocols
  const blockedProtocols = [
    "javascript:",
    "data:",
    "vbscript:"
  ];

  if (blockedProtocols.some(protocol => lowerUrl.startsWith(protocol))) {
    return false;
  }

  // Allow relative URLs, fragments, and specific allowed domains
  // Block protocol-relative URLs (e.g., //attacker.com)
  if (trimmedUrl.startsWith("//")) {
    return false;
  }

  const isRelative = trimmedUrl.startsWith("/") ||
                     trimmedUrl.startsWith("?") ||
                     trimmedUrl.startsWith("#");

  const isAllowedDomain = trimmedUrl.startsWith("https://scoreboard-tailuge.vercel.app/");

  return isRelative || isAllowedDomain;
}
