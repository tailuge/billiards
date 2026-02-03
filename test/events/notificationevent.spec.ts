import { NotificationEvent } from "../../src/events/notificationevent"
import { EventType } from "../../src/events/eventtype"
import { EventUtil } from "../../src/events/eventutil"
import { Controller } from "../../src/controller/controller"

describe("NotificationEvent", () => {
  it("should create a NotificationEvent", () => {
    const event = new NotificationEvent("test message", 1000)
    expect(event.type).toBe(EventType.NOTIFICATION)
    expect(event.data).toBe("test message")
    expect(event.duration).toBe(1000)
  })

  it("should serialise and deserialise", () => {
    const event = new NotificationEvent("test message", 1000)
    const serialised = EventUtil.serialise(event)
    const deserialised = EventUtil.fromSerialised(serialised) as NotificationEvent

    expect(deserialised.type).toBe(EventType.NOTIFICATION)
    expect(deserialised.data).toBe("test message")
    expect(deserialised.duration).toBe(1000)
  })

  it("should apply to controller", () => {
    const event = new NotificationEvent("test message", 1000)
    const mockController = {
      handleNotification: jest.fn().mockReturnThis(),
    } as unknown as Controller

    event.applyToController(mockController)
    expect(mockController.handleNotification).toHaveBeenCalledWith(event)
  })
})
