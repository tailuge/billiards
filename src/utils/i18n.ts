/**
 * Minimal i18n for player-facing strings.
 *
 * English is the key: `t("Hit")` returns "Hit" when no translation exists, so a
 * missing entry degrades to readable English rather than a blank control. Only
 * non-English locales are stored, which keeps English from drifting out of sync
 * with the source strings it is keyed by.
 *
 * Locale selection order: `?locale=` query param (for testing and for sharing a
 * link in a given language), then the browser's preferred languages, then
 * English. Set `document.documentElement.lang` on load so assistive technology
 * announces the strings with the correct voice.
 */

export const LOCALES = ["ko"] as const

export type Locale = (typeof LOCALES)[number]

const translations: Record<Locale, Record<string, string>> = {
  ko: {
    // Button labels are short by design. "Hit" is the shooting action; "Place
    // Ball" keeps the newline so the button still breaks across two lines.
    Hit: "공 치기",
    "Place\nBall": "공\n놓기",
    // Notification dialog buttons (end of game / replay / win / lose). Only the
    // controls are translated; the dialog's title and body stay in the source
    // language. See `src/utils/gameover.ts`.
    "Back to Lobby": "로비로 돌아가기",
    "Back to Arena": "아레나로 돌아가기",
    "New Game": "새 게임",
    Replay: "다시보기",
    Rematch: "재대결",
  },
}

function fromTag(tag: string | undefined | null): Locale | undefined {
  if (!tag) return undefined
  const language = tag.toLowerCase().split("-")[0]
  return LOCALES.find((locale) => locale === language)
}

function fromBrowser(): Locale | undefined {
  const tags = navigator.languages?.length
    ? navigator.languages
    : [navigator.language]
  for (const tag of tags) {
    const locale = fromTag(tag)
    if (locale) return locale
  }
  return undefined
}

let resolved: Locale | undefined

/** Current locale, or undefined when English is in use. */
export function currentLocale(): Locale | undefined {
  if (resolved === undefined) {
    const requested = new URLSearchParams(location.search).get("locale")
    // An explicit ?locale= is authoritative: one we do not ship resolves to
    // English rather than silently falling back to the browser language, which
    // would make the result depend on the visitor's OS.
    resolved = requested ? fromTag(requested) : fromBrowser()
  }
  return resolved
}

/**
 * Translate an English source string, falling back to the string itself.
 */
export function t(key: string): string {
  const locale = currentLocale()
  return (locale && translations[locale]?.[key]) || key
}

if (typeof document !== "undefined") {
  document.documentElement.lang = currentLocale() ?? "en"
}
