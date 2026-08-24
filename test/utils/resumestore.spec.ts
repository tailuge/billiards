import { ResumeStore, ResumeEntry } from "../../src/utils/resumestore"
import { Session } from "../../src/network/client/session"

const entry = (tableId = "table-1"): Omit<ResumeEntry, "msgId"> => ({
  tableId,
  controller: "WatchAim",
  tablejson: { balls: [], aim: undefined },
  score: { p1: 3, p2: 1, b: 2, active: 1 },
  p1type: 1,
})

describe("ResumeStore", () => {
  beforeEach(() => {
    localStorage.clear()
    jest.resetAllMocks()
    Session.init("client-a", "Alice", "table-1", false)
    Session.reset()
    Session.init("client-a", "Alice", "table-1", false)
  })

  it("saves and loads an entry including the noted watermark msgId", () => {
    ResumeStore.noteMsgId("msg-42")
    ResumeStore.save(entry())

    const loaded = ResumeStore.load("table-1")
    expect(loaded).toEqual({ ...entry(), msgId: "msg-42" })
  })

  it("omits msgId when no message has been received", () => {
    ResumeStore.save(entry())

    const loaded = ResumeStore.load("table-1")
    expect(loaded).toBeDefined()
    expect(loaded!.msgId).toBeUndefined()
  })

  it("keeps only the latest watermark", () => {
    ResumeStore.noteMsgId("msg-1")
    ResumeStore.noteMsgId("msg-2")
    ResumeStore.save(entry())

    expect(ResumeStore.load("table-1")!.msgId).toBe("msg-2")
  })

  it("ignores entries stored under another client's slot", () => {
    ResumeStore.save(entry())
    Session.reset()
    Session.init("client-b", "Bob", "table-1", false)

    expect(ResumeStore.load("table-1")).toBeUndefined()
  })

  it("rejects an entry whose tableId does not match (stale tab)", () => {
    ResumeStore.save(entry("old-table"))

    expect(ResumeStore.load("table-1")).toBeUndefined()
  })

  it("returns undefined after clear", () => {
    ResumeStore.save(entry())
    ResumeStore.clear()

    expect(ResumeStore.load("table-1")).toBeUndefined()
  })

  it("returns undefined for corrupt storage content", () => {
    localStorage.setItem("resume.client-a", "{not json")

    expect(() => ResumeStore.load("table-1")).toThrow()
  })
})
