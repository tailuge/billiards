import { ConcedeEvent } from "../../src/events/concedeevent"
import { EventType } from "../../src/events/eventtype"
import { EventUtil } from "../../src/events/eventutil"
import { Controller } from "../../src/controller/controller"

describe("ConcedeEvent", () => {
  it("should create a ConcedeEvent", () => {
    const event = new ConcedeEvent()
    expect(event.type).toBe(EventType.CONCEDE)
  })

  it("should serialise and deserialise", () => {
    const event = new ConcedeEvent()
    const serialised = EventUtil.serialise(event)
    const deserialised = EventUtil.fromSerialised(serialised) as ConcedeEvent

    expect(deserialised.type).toBe(EventType.CONCEDE)
  })

  it("should apply to controller", () => {
    const event = new ConcedeEvent()
    const mockController = {
      handleConcede: jest.fn().mockReturnThis(),
    } as unknown as Controller

    event.applyToController(mockController)
    expect(mockController.handleConcede).toHaveBeenCalledWith(event)
  })
})
