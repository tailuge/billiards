import { Container } from "../../src/container/container"
import { EventType } from "../../src/events/eventtype"
import { Assets } from "../../src/view/assets"
import { canvas3d, initDom } from "./dom"

initDom()

describe("LinkFormatter", () => {
  let container: Container

  beforeEach(() => {
    container = new Container({
      element: canvas3d,
      log: () => {},
      assets: Assets.localAssets(),
    })
  })

  it("wholeGameLink should add a link to the ball tray", () => {
    const game = {
      shots: [
        { type: EventType.AIM },
        { type: EventType.SCORE },
        { type: EventType.PLACEBALL },
        { type: EventType.AIM },
        { type: EventType.RERACK },
      ],
    }

    container.linkFormatter.wholeGameLink(game)

    expect(container.ballTray.entries).toHaveLength(1)
    const entry = container.ballTray.entries[0]
    expect(entry.icon).toBe("Ⓡ")
    expect(entry.label).toBe("Whole Game")
  })

  it("getReplayUri should return a valid URI", () => {
    const uri = container.linkFormatter.getReplayUri({ test: 1 })
    expect(uri).toBeTruthy()
  })

  it("getHiScoreUri should return a valid URI with ruletype", () => {
    const uri = container.linkFormatter.getHiScoreUri({ test: 1 }, 10)
    expect(uri).toContain("hiscore.html")
    expect(uri).toContain("ruletype=")
  })

  it("getHiScoreUri should include score and v inside state object", () => {
    const state = { test: 1 }
    const score = 10
    const uri = container.linkFormatter.getHiScoreUri(state, score)

    const url = new URL(uri)
    const compressed = decodeURIComponent(url.searchParams.get("state")!)
    const uncrushed = require("jsoncrush").default.uncrush(compressed)
    const payload = JSON.parse(uncrushed)

    // Current behavior (broken according to issue)
    // payload = { v: 1, state: { test: 1 }, score: 10 }
    // Expected behavior (fixed)
    // payload = { test: 1, score: 10, v: 1 }

    expect(payload.score).toBe(10)
    expect(payload.v).toBe(1)
    expect(payload.test).toBe(1)
    expect(payload.state).toBeUndefined()
  })
})
