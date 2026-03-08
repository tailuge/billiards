/**
 * ClientErrorReporter - Captures client-side errors and reports them to a server endpoint.
 *
 * USAGE:
 * 1. Import and instantiate with your error collection endpoint
 * 2. Call start() to begin capturing errors:
 *    reporter.start()
 * 3. Call stop() when done (e.g., on page unload or component unmount):
 *    reporter.stop()
 *
 * ENDPOINT:
 * The default endpoint for this project is hosted at:
 *   https://scoreboard-tailuge.vercel.app/api/client-error
 *
 * CORS:
 * The endpoint must include appropriate CORS headers (Access-Control-Allow-Origin)
 * to allow cross-origin requests from client applications.
 *
 * CAPTURED SOURCES:
 * - console.error and console.warn calls
 * - window.onerror (uncaught JavaScript errors)
 * - window.onunhandledrejection (unhandled Promise rejections)
 * @example
 * // Basic usage with default settings
 * const reporter = new ClientErrorReporter("https://scoreboard-tailuge.vercel.app/api/client-error")
 * reporter.start()
 *
 */

export interface ErrorReport {
  type: string
  message: string
  stack?: string
  url: string
  ts: number
  sid: string
}

export class ClientErrorReporter {
  private readonly endpoint: string
  private readonly sid: string
  private queue: ErrorReport[] = []
  private readonly seen = new Map<string, number>()

  private readonly maxPerKey: number
  private readonly flushIntervalMs: number
  private readonly maxQueueSize: number

  private intervalId: ReturnType<typeof setInterval> | undefined
  private readonly boundFlush: () => void
  private originalConsoleError?: typeof console.error
  private originalConsoleWarn?: typeof console.warn

  constructor(
    endpoint: string,
    options?: {
      maxPerKey?: number
      flushIntervalMs?: number
      maxQueueSize?: number
    }
  ) {
    this.endpoint = endpoint
    this.sid = this.generateSid()
    this.maxPerKey = options?.maxPerKey ?? 3
    this.flushIntervalMs = options?.flushIntervalMs ?? 5000
    this.maxQueueSize = options?.maxQueueSize ?? 20

    this.boundFlush = this.flush.bind(this)
  }

  private generateSid(): string {
    try {
      return crypto.randomUUID()
    } catch {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = Math.trunc(Math.random() * 16)
        const v = c === "x" ? r : (r & 0x3) | 0x8
        return v.toString(16)
      })
    }
  }

  start() {
    this.patchConsole()
    this.patchGlobalErrors()

    this.intervalId = setInterval(this.boundFlush, this.flushIntervalMs)

    globalThis.addEventListener("pagehide", this.boundFlush)
  }

  stop() {
    this.flush(true)

    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = undefined
    }

    globalThis.removeEventListener("pagehide", this.boundFlush)

    if (this.originalConsoleError) {
      console.error = this.originalConsoleError
    }
    if (this.originalConsoleWarn) {
      console.warn = this.originalConsoleWarn
    }
  }

  private patchConsole() {
    this.originalConsoleError = console.error
    this.originalConsoleWarn = console.warn

    console.error = (...args: unknown[]) => {
      this.capture("error", args)
      this.originalConsoleError!.apply(console, args)
    }

    console.warn = (...args: unknown[]) => {
      this.capture("warn", args)
      this.originalConsoleWarn!.apply(console, args)
    }
  }

  private patchGlobalErrors() {
    globalThis.addEventListener("error", (e) => {
      this.capture("uncaught", [e.error || e.message])
    })

    globalThis.addEventListener("unhandledrejection", (e) => {
      this.capture("promise", [e.reason])
    })
  }

  private capture(type: string, args: unknown[]) {
    try {
      let message = args.map(String).join(" ")
      let stack: string | undefined

      if (args[0] instanceof Error) {
        message = args[0].message
        stack = args[0].stack
      }

      const key = type + ":" + message
      const count = (this.seen.get(key) ?? 0) + 1
      this.seen.set(key, count)

      if (count > this.maxPerKey) return

      this.queue.push({
        type,
        message,
        ...(stack ? { stack } : {}),
        url: globalThis.location?.href ?? "",
        ts: Date.now(),
        sid: this.sid,
      })

      if (this.queue.length > this.maxQueueSize) this.flush()
    } catch {
      // do nothing
    }
  }

  private flush(useBeacon = true) {
    try {
      if (!this.queue.length) return

      const payload = JSON.stringify(this.queue)
      this.queue = []

      if (useBeacon && navigator.sendBeacon) {
        navigator.sendBeacon(this.endpoint, payload)
        return
      }

      fetch(this.endpoint, {
        method: "POST",
        body: payload,
        keepalive: true,
        headers: { "content-type": "application/json" },
      }).catch(() => {
        // do nothing
      })
    } catch {
      // do nothing
    }
  }
}
