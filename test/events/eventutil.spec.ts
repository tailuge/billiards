import { expect } from "chai"
import { AimEvent } from "../../src/events/aimevent"
import { AbortEvent } from "../../src/events/abortevent"
import { WatchEvent } from "../../src/events/watchevent"
import { EventUtil } from "../../src/events/eventutil"
import { EventType } from "../../src/events/eventtype"
import { Table } from "../../src/model/table"
import { Rack } from "../../src/utils/rack"
import { BreakEvent } from "../../src/events/breakevent"
import { PlaceBallEvent } from "../../src/events/placeballevent"
import { zero } from "../../src/utils/utils"
import { ChatEvent } from "../../src/events/chatevent"
import { BeginEvent } from "../../src/events/beginevent"
import { HitEvent } from "../../src/events/hitevent"

describe("EventUtil", () => {
  it("Serialise and deserialise AimEvent", (done) => {
    const event: AimEvent = new AimEvent()
    event.i = 1
    const serialised = EventUtil.serialise(event)
    const deserialised = <AimEvent>EventUtil.fromSerialised(serialised)
    expect(deserialised.type).to.equal(EventType.AIM)
    done()
  })

  it("Serialise and deserialise AbortEvent", (done) => {
    const serialised = EventUtil.serialise(new AbortEvent())
    const deserialised = EventUtil.fromSerialised(serialised)
    expect(deserialised.type).to.equal(EventType.ABORT)
    done()
  })

  it("Serialise and deserialise WatchEvent", (done) => {
    const table = new Table(Rack.diamond())
    const serialised = EventUtil.serialise(new WatchEvent(table.serialise()))
    const deserialised = EventUtil.fromSerialised(serialised)
    expect(deserialised.type).to.equal(EventType.WATCHAIM)
    done()
  })

  it("Serialise and deserialise BreakEvent", (done) => {
    const serialised = EventUtil.serialise(new BreakEvent())
    const deserialised = EventUtil.fromSerialised(serialised)
    expect(deserialised.type).to.equal(EventType.BREAK)
    done()
  })

  it("Serialise and deserialise PlaceBallEvent", (done) => {
    const serialised = EventUtil.serialise(new PlaceBallEvent(zero, true))
    const deserialised = EventUtil.fromSerialised(serialised)
    expect(deserialised.type).to.equal(EventType.PLACEBALL)
    done()
  })

  it("Throw on unknown event", (done) => {
    expect(() => EventUtil.fromSerialised("{}")).to.throw()
    done()
  })

  it("Serialise and deserialise ChatEvent", (done) => {
    const serialised = EventUtil.serialise(new ChatEvent("a", "m"))
    const deserialised = EventUtil.fromSerialised(serialised)
    expect(deserialised.type).to.equal(EventType.CHAT)
    done()
  })

  it("Serialise and deserialise BeginEvent", (done) => {
    const serialised = EventUtil.serialise(new BeginEvent())
    const deserialised = EventUtil.fromSerialised(serialised)
    expect(deserialised.type).to.equal(EventType.BEGIN)
    done()
  })

  it("Serialise and deserialise HitEvent", (done) => {
    const table = new Table([])
    const event = new HitEvent(table.serialise())
    event.sequence = "seq-1000"
    const serialised = EventUtil.serialise(event)
    const deserialised = EventUtil.fromSerialised(serialised)
    expect(deserialised.type).to.equal(EventType.HIT)
    expect(deserialised.sequence).to.equal("seq-1000")
    done()
  })
})
