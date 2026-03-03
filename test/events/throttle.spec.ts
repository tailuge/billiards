import { expect } from "chai"
import { Throttle } from "../../src/events/throttle"
import { EventType } from "../../src/events/eventtype"
import { GameEvent } from "../../src/events/gameevent"

class MockEvent extends GameEvent {
  constructor(type: EventType) {
    super()
    this.type = type
  }
  applyToController(controller: any) {
    return controller
  }
}

describe("Throttle", () => {
  let nowValue = 1000
  let originalNow: any

  beforeEach(() => {
    nowValue = 1000
    originalNow = performance.now
    performance.now = () => nowValue
  })

  afterEach(() => {
    performance.now = originalNow
  })

  it("should immediately send a non-AIM message", () => {
    let sentEvent: any = null
    const throttle = new Throttle(250, (event) => {
      sentEvent = event
    })
    const event = new MockEvent(EventType.HIT)
    throttle.send(event)
    expect(sentEvent).to.equal(event)
  })

  it("should immediately send the first AIM message", () => {
    let sentEvent: any = null
    const throttle = new Throttle(250, (event) => {
      sentEvent = event
    })
    const event = new MockEvent(EventType.AIM)
    throttle.send(event)
    expect(sentEvent).to.equal(event)
  })

  it("should skip subsequent AIM messages if sent within the period", () => {
    const sentEvents: any[] = []
    const throttle = new Throttle(250, (event) => {
      sentEvents.push(event)
    })

    const event1 = new MockEvent(EventType.AIM)
    const event2 = new MockEvent(EventType.AIM)

    throttle.send(event1)
    nowValue += 100 // 100ms later
    throttle.send(event2)

    expect(sentEvents).to.have.lengthOf(1)
    expect(sentEvents[0]).to.equal(event1)
  })

  it("should send AIM message if sent after the period", () => {
    const sentEvents: any[] = []
    const throttle = new Throttle(250, (event) => {
      sentEvents.push(event)
    })

    const event1 = new MockEvent(EventType.AIM)
    const event2 = new MockEvent(EventType.AIM)

    throttle.send(event1)
    nowValue += 251 // 251ms later
    throttle.send(event2)

    expect(sentEvents).to.have.lengthOf(2)
    expect(sentEvents[0]).to.equal(event1)
    expect(sentEvents[1]).to.equal(event2)
  })

  it("should always send non-AIM messages even if an AIM was just sent", () => {
    const sentEvents: any[] = []
    const throttle = new Throttle(250, (event) => {
      sentEvents.push(event)
    })

    const event1 = new MockEvent(EventType.AIM)
    const event2 = new MockEvent(EventType.HIT)

    throttle.send(event1)
    nowValue += 100 // 100ms later
    throttle.send(event2)

    expect(sentEvents).to.have.lengthOf(2)
    expect(sentEvents[0]).to.equal(event1)
    expect(sentEvents[1]).to.equal(event2)
  })

  it("should NOT send skipped AIM messages when a subsequent non-AIM message is sent", () => {
    const sentEvents: any[] = []
    const throttle = new Throttle(250, (event) => {
      sentEvents.push(event)
    })

    const event1 = new MockEvent(EventType.AIM)
    const event2 = new MockEvent(EventType.AIM)
    const event3 = new MockEvent(EventType.HIT)

    throttle.send(event1)
    nowValue += 100
    throttle.send(event2) // Should be skipped in new implementation, but pending in old
    nowValue += 50
    throttle.send(event3) // Should be sent immediately

    expect(sentEvents).to.have.lengthOf(2)
    expect(sentEvents[0]).to.equal(event1)
    expect(sentEvents[1]).to.equal(event3)
  })
})
