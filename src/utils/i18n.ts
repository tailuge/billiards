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
    Hit: "공치기",
    "Place\nBall": "공놓기",
    // Notification dialog buttons. Only the controls are translated; the
    // dialog's title and body stay in the source language. Where the button
    // reads naturally with a different word order, `{name}` placeholders keep
    // the English source grammatical while the translation stays native.
    "Back to Lobby": "로비로 돌아가기",
    "Back to Arena": "아레나로 돌아가기",
    "New Game": "새 게임",
    Replay: "다시보기",
    Rematch: "재대결",
    // Concede confirmation.
    Concede: "기권",
    "Play on": "계속하기",
    // Three-cushion break prompt: stop and take the win, or carry the run on.
    "Declare win": "승리 선언",
    "Continue break": "이어서 치기",
    // Reveal (card game) game over.
    "Update Deck": "덱 바꾸기",
    // Banner controls.
    "Share replay link": "리플레이 링크 공유",
    share: "공유",
    upload: "업로드",
    "Break : {score}": "브레이크: {score}",
    "Open high break {score}": "하이브레이크 {score} 보기",
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
 * Optional `params` fill `{name}` placeholders (e.g. a score).
 */
export function t(
  key: string,
  params?: Record<string, string | number>
): string {
  const locale = currentLocale()
  const template = (locale && translations[locale]?.[key]) || key
  if (!params) return template
  return template.replace(/\{(\w+)\}/g, (match, name) =>
    name in params ? String(params[name]) : match
  )
}

if (typeof document !== "undefined") {
  document.documentElement.lang = currentLocale() ?? "en"
}
