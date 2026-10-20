// The locale is resolved once and memoised in module scope, so load a fresh
// copy after resetting the module.
function loadI18n() {
  let mod: typeof import("../../src/utils/i18n")
  jest.isolateModules(() => {
    mod = require("../../src/utils/i18n")
  })
  return mod!
}

function setLanguages(languages: string[]) {
  Object.defineProperty(globalThis.navigator, "languages", {
    value: languages,
    configurable: true,
  })
}

describe("i18n", () => {
  it("translates for the selected locale and falls back to the English key", () => {
    const originalSearch = globalThis.location.search
    try {
      globalThis.history.replaceState({}, "", "?locale=ko")
      const { t } = loadI18n()
      // One phrase is enough to prove the lookup works; a missing key falls
      // back to the English source string.
      expect(t("Hit")).toBe("공치기")
      expect(t("Continue")).toBe("Continue")
      expect(t("Break : {score}", { score: 3 })).toBe("브레이크: 3")
      // Billiards-native terms: 자유구 (ball in hand), 선공 (you break),
      // 선취 N점 (points race length).
      expect(t("Ball in hand")).toBe("자유구")
      expect(t("You first")).toBe("선공")
      expect(t("Race to: {score}", { score: 20 })).toBe("선취 20점")
      // Notification titles.
      expect(t("FOUL")).toBe("파울")
      expect(t("YOU WON")).toBe("승리")
      expect(t("YOU LOST")).toBe("패배")
      expect(t("GAME OVER")).toBe("경기 종료")
      expect(t("Concede Game")).toBe("경기 기권")
      expect(t("Replay Complete")).toBe("다시보기 완료")
      expect(t("Waiting for opponent to join")).toBe("상대 입장 대기 중")
      expect(document.documentElement.lang).toBe("ko")

      // Chinese ships one Traditional dictionary. Every `zh-*` tag resolves to
      // it, so Simplified-browser visitors get Traditional characters rather
      // than English, and the document advertises `zh-Hant` so the browser
      // picks Traditional glyphs instead of guessing from the region.
      globalThis.history.replaceState({}, "", "?locale=zh")
      expect(loadI18n().t("Hit")).toBe("擊球")
      expect(loadI18n().t("Place\nBall")).toBe("放置\n母球")
      expect(loadI18n().t("FOUL")).toBe("犯規")
      expect(loadI18n().t("YOU WON")).toBe("勝利")
      expect(loadI18n().t("Race to: {score}", { score: 20 })).toBe("搶 20 分")
      expect(loadI18n().t("Break : {score}", { score: 3 })).toBe("單桿：3")
      expect(document.documentElement.lang).toBe("zh-Hant")

      for (const tag of ["zh-TW", "zh-HK", "zh-CN", "zh-Hans"]) {
        globalThis.history.replaceState({}, "", `?locale=${tag}`)
        expect(loadI18n().t("Ball in hand")).toBe("自由球")
        expect(document.documentElement.lang).toBe("zh-Hant")
      }

      // Browser detection strips the region the same way, so a Simplified
      // OS preference (zh-CN) still reads Traditional rather than English.
      globalThis.history.replaceState({}, "", "?")
      setLanguages(["zh-CN", "en-US"])
      expect(loadI18n().t("YOU LOST")).toBe("落敗")

      // Unsupported explicit locale resolves to English rather than to the
      // browser language, so the result does not depend on the visitor's OS.
      setLanguages(["ko-KR"])
      globalThis.history.replaceState({}, "", "?locale=fr")
      expect(loadI18n().t("Hit")).toBe("Hit")

      globalThis.history.replaceState({}, "", "?")
      setLanguages(["ko-KR", "en-US"])
      expect(loadI18n().t("Hit")).toBe("공치기")

      globalThis.history.replaceState({}, "", "?")
      setLanguages(["en-US"])
      expect(loadI18n().t("Hit")).toBe("Hit")
    } finally {
      globalThis.history.replaceState({}, "", originalSearch || "?")
    }
  })
})
