import { BotRelay } from "../../../src/network/bot/botrelay"
import { Logger } from "../../../src/network/bot/logger"
import { Container } from "../../../src/container/container"
import { Assets } from "../../../src/view/assets"
import { EventType } from "../../../src/events/eventtype"
import { EventUtil } from "../../../src/events/eventutil"
import { AimEvent } from "../../../src/events/aimevent"
import { ChatEvent } from "../../../src/events/chatevent"
import { StartAimEvent } from "../../../src/events/startaimevent"
import { BeginEvent } from "../../../src/events/beginevent"
import { Outcome } from "../../../src/model/outcome"
import { NineBall } from "../../../src/controller/rules/nineball"
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
    jest.clearAllTimers()
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
      const chatEvent = new ChatEvent("me", "hello")
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

    it("should log error if message parsing fails", () => {
      const logSpy = jest.spyOn(logger, "incoming")
      botRelay.publish("channel", "invalid json")
      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining("Error parsing message")
      )
    })
  })

  describe("processQueue", () => {
    it("should process messages in the queue after a delay", () => {
      const chatEvent = new ChatEvent("me", "hello")
      const message = EventUtil.serialise(chatEvent)

      // Accessing private handle to verify it's called
      const handleSpy = jest.spyOn((botRelay as any).eventHandler, "handle")

      botRelay.publish("channel", message)

      expect(handleSpy).not.toHaveBeenCalled()

      jest.advanceTimersByTime(500)

      expect(handleSpy).toHaveBeenCalled()
    })

    it("should log error if event handling fails", () => {
      const logSpy = jest.spyOn(logger, "incoming")
      // Mock handle to throw
      jest
        .spyOn((botRelay as any).eventHandler, "handle")
        .mockImplementation(() => {
          throw new Error("fail")
        })

      botRelay.enqueueMessage(EventUtil.serialise(new ChatEvent("me", "msg")))
      jest.advanceTimersByTime(500)

      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining("Error handling message")
      )
    })

    it("should process multiple messages sequentially", () => {
      const handleSpy = jest.spyOn((botRelay as any).eventHandler, "handle")

      botRelay.enqueueMessage(EventUtil.serialise(new ChatEvent("me", "1")))
      botRelay.enqueueMessage(EventUtil.serialise(new ChatEvent("me", "2")))

      jest.advanceTimersByTime(500)
      expect(handleSpy).toHaveBeenCalledTimes(1)

      jest.advanceTimersByTime(500)
      expect(handleSpy).toHaveBeenCalledTimes(2)
    })

    it("should call publishSequenceToPlayer via event handler", () => {
      const startAimEvent = new StartAimEvent()
      const message = EventUtil.serialise(startAimEvent)

      const publishSpy = jest.spyOn(botRelay, "publishSequenceToPlayer")

      botRelay.enqueueMessage(message)
      jest.advanceTimersByTime(500)

      expect(publishSpy).toHaveBeenCalled()
    })

    it("should call enqueueMessage via event handler when pot occurs", () => {
      // Mock potCount to return 1
      jest.spyOn(Outcome, "potCount").mockReturnValue(1)
      // Mock foulReason to return null
      jest.spyOn(NineBall, "foulReason").mockReturnValue(null)

      const enqueueSpy = jest.spyOn(botRelay, "enqueueMessage")

      botRelay.enqueueMessage(EventUtil.serialise(new BeginEvent()))
      jest.advanceTimersByTime(500)

      expect(enqueueSpy).toHaveBeenCalledTimes(2) // 1 from test, 1 from bot logic
    })
  })

  describe("publishSequenceToPlayer", () => {
    it("should send events to player with delay", () => {
      const callback = jest.fn()
      botRelay.subscribe("channel", callback)
      callback.mockClear()

      const events = [new ChatEvent("me", "1"), new ChatEvent("me", "2")]
      botRelay.publishSequenceToPlayer(events, 100)

      expect(callback).not.toHaveBeenCalled()

      jest.advanceTimersByTime(100)
      expect(callback).toHaveBeenCalledTimes(1)
      expect(EventUtil.fromSerialised(callback.mock.calls[0][0]).type).toBe(
        EventType.CHAT
      )

      jest.advanceTimersByTime(100)
      expect(callback).toHaveBeenCalledTimes(2)
    })

    it("should clear existing sequence timeout if new sequence is published", () => {
      const callback = jest.fn()
      botRelay.subscribe("channel", callback)
      callback.mockClear()

      botRelay.publishSequenceToPlayer([new ChatEvent("me", "first")], 100)
      botRelay.publishSequenceToPlayer([new ChatEvent("me", "second")], 100)

      jest.advanceTimersByTime(100)
      expect(callback).toHaveBeenCalledTimes(1)
      const event = EventUtil.fromSerialised(
        callback.mock.calls[0][0]
      ) as ChatEvent
      expect(event.message).toBe("second")
    })

    it("should return early if events list is empty", () => {
      const callback = jest.fn()
      botRelay.subscribe("channel", callback)
      callback.mockClear()

      botRelay.publishSequenceToPlayer([], 100)
      jest.advanceTimersByTime(100)
      expect(callback).not.toHaveBeenCalled()
    })
  })

  describe("getOnlineCount", () => {
    it("should return 2", async () => {
      const count = await botRelay.getOnlineCount()
      expect(count).toBe(2)
    })
  })
})
