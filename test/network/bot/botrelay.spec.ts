import { BotRelay } from "../../../src/network/bot/botrelay"
import { Logger } from "../../../src/network/bot/logger"
import { Container } from "../../../src/container/container"
import { Assets } from "../../../src/view/assets"
import { EventType } from "../../../src/events/eventtype"
import { EventUtil } from "../../../src/events/eventutil"
import { AimEvent } from "../../../src/events/aimevent"
import { ChatEvent } from "../../../src/events/chatevent"
import { initDom } from "../../view/dom"
import { Vector3 } from "three"
import { Session } from "../../../src/network/client/session"

initDom()

describe("BotRelay", () => {
  let logger: Logger
  let container: Container
  let botRelay: BotRelay

  beforeEach(() => {
    Session.init("test-client", "TestPlayer", "test-table", false)
    logger = new Logger()
    container = new Container({
      element: undefined,
      log: () => {},
      assets: Assets.localAssets(),
      ruletype: "nineball",
    })
    botRelay = new BotRelay(logger, container)
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  describe("subscribe", () => {
    it("should call the callback with a BEGIN event", () => {
      const callback = jest.fn()
      botRelay.subscribe("test-channel", callback)

      expect(callback).toHaveBeenCalledTimes(1)
      const message = callback.mock.calls[0][0]
      const event = EventUtil.fromSerialised(message)
      expect(event.type).toBe(EventType.BEGIN)
    })
  })

  describe("publish", () => {
    it("should enqueue non-AIM messages", () => {
      const chatEvent = new ChatEvent("hello")
      const message = EventUtil.serialise(chatEvent)

      const enqueueSpy = jest.spyOn(botRelay, "enqueueMessage")
      botRelay.publish("channel", message)

      expect(enqueueSpy).toHaveBeenCalledWith(message)
    })

    it("should not enqueue AIM messages", () => {
      const aimEvent = new AimEvent(new Vector3(), 0, 0, new Vector3())
      const message = EventUtil.serialise(aimEvent)

      const enqueueSpy = jest.spyOn(botRelay, "enqueueMessage")
      botRelay.publish("channel", message)

      expect(enqueueSpy).not.toHaveBeenCalled()
    })
  })

  describe("processQueue", () => {
    it("should process messages in the queue after a delay", () => {
      const chatEvent = new ChatEvent("hello")
      const message = EventUtil.serialise(chatEvent)

      // Accessing private handle to verify it's called
      const handleSpy = jest.spyOn((botRelay as any).eventHandler, "handle")

      botRelay.publish("channel", message)

      expect(handleSpy).not.toHaveBeenCalled()

      jest.advanceTimersByTime(500)

      expect(handleSpy).toHaveBeenCalled()
    })
  })

  describe("publishSequenceToPlayer", () => {
    it("should send events to player with delay", () => {
      const callback = jest.fn()
      botRelay.subscribe("channel", callback)
      callback.mockClear()

      const events = [new ChatEvent("1"), new ChatEvent("2")]
      botRelay.publishSequenceToPlayer(events, 100)

      expect(callback).not.toHaveBeenCalled()

      jest.advanceTimersByTime(100)
      expect(callback).toHaveBeenCalledTimes(1)
      expect(EventUtil.fromSerialised(callback.mock.calls[0][0]).type).toBe(EventType.CHAT)

      jest.advanceTimersByTime(100)
      expect(callback).toHaveBeenCalledTimes(2)
    })
  })

  describe("getOnlineCount", () => {
    it("should return 2", async () => {
      const count = await botRelay.getOnlineCount()
      expect(count).toBe(2)
    })
  })
})
