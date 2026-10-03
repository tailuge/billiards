// The locale is resolved once and memoised in module scope, so load a fresh
// copy after resetting the module.
function loadI18n() {
  let mod: typeof import("../../src/i18n")
  jest.isolateModules(() => {
    mod = require("../../src/i18n")
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
  it("translates when Korean is selected, else returns the English key", () => {
    const originalSearch = globalThis.location.search
    try {
      globalThis.history.replaceState({}, "", "?locale=ko")
      const { t } = loadI18n()
      expect(t("Hit")).toBe("공 치기")
      expect(t("Place\nBall")).toBe("공\n놓기")
      expect(t("Continue")).toBe("Continue")
      expect(document.documentElement.lang).toBe("ko")

      // Unsupported explicit locale resolves to English rather than to the
      // browser language, so the result does not depend on the visitor's OS.
      setLanguages(["ko-KR"])
      globalThis.history.replaceState({}, "", "?locale=fr")
      expect(loadI18n().t("Hit")).toBe("Hit")

      globalThis.history.replaceState({}, "", "?")
      setLanguages(["ko-KR", "en-US"])
      expect(loadI18n().t("Hit")).toBe("공 치기")

      globalThis.history.replaceState({}, "", "?")
      setLanguages(["en-US"])
      expect(loadI18n().t("Hit")).toBe("Hit")
    } finally {
      globalThis.history.replaceState({}, "", originalSearch || "?")
    }
  })
})
