import { Container } from "../../src/container/container"
import { ChatEvent } from "../../src/events/chatevent"
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

  it("wholeGameLink should count only AIM events as shots", () => {
    const game = {
      shots: [
        { type: EventType.AIM },
        { type: EventType.SCORE },
        { type: EventType.PLACEBALL },
        { type: EventType.AIM },
        { type: EventType.RERACK },
      ],
    }

    container.eventQueue = []
    container.linkFormatter.wholeGameLink(game)

    expect(container.eventQueue).toHaveLength(1)
    const chatEvent = container.eventQueue[0] as ChatEvent
    expect(chatEvent.type).toBe(EventType.CHAT)
    expect(chatEvent.message).toContain("frame(2 shots)")
  })

  it("getReplayUri should return a valid URI", () => {
    const uri = container.linkFormatter.getReplayUri({ test: 1 })
    expect(uri).toBeTruthy()
  })

  it("getHiScoreUri should return a valid URI with ruletype", () => {
    const uri = container.linkFormatter.getHiScoreUri({ test: 1 })
    expect(uri).toContain("hiscore.html")
    expect(uri).toContain("ruletype=")
  })
})
