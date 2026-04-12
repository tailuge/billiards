import { share } from "../../src/utils/shorten"

describe("shorten", () => {
  describe("share", () => {
    let originalNavigator: any

    beforeEach(() => {
      originalNavigator = global.window.navigator
    })

    afterEach(() => {
      Object.defineProperty(global.window, "navigator", {
        value: originalNavigator,
        configurable: true,
      })
    })

    it("should return 'link shared' if navigator.canShare is true", async () => {
      const url = "https://example.com"
      Object.defineProperty(global.window, "navigator", {
        value: {
          canShare: () => true,
          share: () => Promise.resolve(),
        },
        configurable: true,
      })

      const result = await share(url)
      expect(result).toBe("link shared")
    })

    it("should return success message if clipboard write succeeds", async () => {
      const url = "https://example.com"
      const writeText = jest.fn().mockResolvedValue(undefined)
      Object.defineProperty(global.window, "navigator", {
        value: {
          canShare: () => false,
          clipboard: {
            writeText,
          },
        },
        configurable: true,
      })

      const result = await share(url)
      expect(writeText).toHaveBeenCalledWith(url)
      expect(result).toBe(`link copied to clipboard <a href="${url}">${url}</a>`)
    })

    it("should return fallback message if clipboard write fails", async () => {
      const url = "https://example.com"
      const writeText = jest.fn().mockRejectedValue(new Error("NotAllowedError"))
      Object.defineProperty(global.window, "navigator", {
        value: {
          canShare: () => false,
          clipboard: {
            writeText,
          },
        },
        configurable: true,
      })

      const result = await share(url)
      expect(writeText).toHaveBeenCalledWith(url)
      expect(result).toBe(`link for sharing <a href="${url}">${url}</a>`)
    })

    it("should return fallback message if navigator.clipboard is missing", async () => {
      const url = "https://example.com"
      Object.defineProperty(global.window, "navigator", {
        value: {
          canShare: () => false,
        },
        configurable: true,
      })

      const result = await share(url)
      expect(result).toBe(`link for sharing <a href="${url}">${url}</a>`)
    })
  })
})
