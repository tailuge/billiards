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
  it("translates a phrase when Korean is selected, else returns the English key", () => {
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
