import { share, shorten } from "../../src/utils/shorten"

describe("shorten utils", () => {
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
      const consoleSpy = jest.spyOn(console, "log").mockImplementation()
      const shareMock = jest.fn().mockResolvedValue(undefined)
      Object.defineProperty(global.window, "navigator", {
        value: {
          canShare: () => true,
          share: shareMock,
        },
        configurable: true,
      })

      const result = await share(url)
      expect(result).toBe("link shared")
      expect(shareMock).toHaveBeenCalled()

      // wait for the success block to be executed
      for (let i = 0; i < 5; i++) await Promise.resolve()
      expect(consoleSpy).toHaveBeenCalledWith("shared successfully")
      consoleSpy.mockRestore()
    })

    it("should log error if navigator.share fails", async () => {
      const url = "https://example.com"
      const consoleSpy = jest.spyOn(console, "error").mockImplementation()
      const shareMock = jest.fn().mockRejectedValue(new Error("Share failed"))
      Object.defineProperty(global.window, "navigator", {
        value: {
          canShare: () => true,
          share: shareMock,
        },
        configurable: true,
      })

      const result = await share(url)
      expect(result).toBe("link shared")
      // wait for the catch block to be executed
      for (let i = 0; i < 5; i++) await Promise.resolve()
      expect(consoleSpy).toHaveBeenCalledWith("Share failed", expect.any(Error))
      consoleSpy.mockRestore()
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

  describe("shorten", () => {
    let originalFetch: any
    let originalProcess: any

    beforeEach(() => {
      originalFetch = global.fetch
      originalProcess = global.process
    })

    afterEach(() => {
      global.fetch = originalFetch
      global.process = originalProcess
      jest.restoreAllMocks()
    })

    it("should return immediate action if process is object", () => {
      const url = "https://example.com"
      const action = jest.fn()
      // @ts-expect-error mocking process
      global.process = { type: "object" }

      shorten(url, action)
      expect(action).toHaveBeenCalledWith(url)
    })

    it("should shorten URL via fetch", async () => {
      const url = "https://example.com/page?param=(test)!"
      const shortUrl = "https://bit.ly/short"
      const action = jest.fn()

      // @ts-expect-error mocking process
      delete global.process

      global.fetch = jest.fn().mockResolvedValue({
        json: () => Promise.resolve({ shortUrl }),
      })

      shorten(url, action)

      // wait for promises
      for (let i = 0; i < 5; i++) await Promise.resolve()

      expect(global.fetch).toHaveBeenCalled()
      expect(action).toHaveBeenCalledWith(shortUrl)
    })

    it("should handle fetch failure", async () => {
      const url = "https://example.com"
      const action = jest.fn()

      // @ts-expect-error mocking process
      delete global.process

      global.fetch = jest.fn().mockRejectedValue(new Error("Network error"))
      const consoleSpy = jest.spyOn(console, "error").mockImplementation()

      shorten(url, action)

      for (let i = 0; i < 5; i++) await Promise.resolve()

      expect(action).toHaveBeenCalledWith(url)
      expect(consoleSpy).toHaveBeenCalled()
      consoleSpy.mockRestore()
    })

    it("should handle invalid response from shorten endpoint", async () => {
      const url = "https://example.com"
      const action = jest.fn()

      // @ts-expect-error mocking process
      delete global.process

      global.fetch = jest.fn().mockResolvedValue({
        json: () => Promise.resolve({ error: "too long" }),
      })
      const consoleSpy = jest.spyOn(console, "error").mockImplementation()

      shorten(url, action)

      for (let i = 0; i < 5; i++) await Promise.resolve()

      expect(action).toHaveBeenCalledWith(url)
      expect(consoleSpy).toHaveBeenCalled()
      consoleSpy.mockRestore()
    })
  })
})


  describe("URL formatting", () => {
    it("should escape special characters in URL", async () => {
      const url = "https://example.com/search?q=()!*"
      const action = jest.fn()
      // @ts-expect-error mocking process
      delete global.process
      global.fetch = jest.fn().mockResolvedValue({
        json: () => Promise.resolve({ shortUrl: "short" })
      })

      shorten(url, action)
      for (let i = 0; i < 5; i++) await Promise.resolve()

      const fetchCall = (global.fetch as jest.Mock).mock.calls[0]
      const body = JSON.parse(fetchCall[1].body)
      expect(body.input).toBe("?q=%28%29%21%2A")
    })
  })
