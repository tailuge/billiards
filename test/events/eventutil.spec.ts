import "mocha"
import { expect } from "chai"
import { AimEvent } from "../../src/events/aimevent"
import { AbortEvent } from "../../src/events/abortevent"
import { WatchEvent } from "../../src/events/watchevent"
import { GameEvent } from "../../src/events/gameevent"
import { EventUtil } from "../../src/events/eventutil"
import { EventType } from "../../src/events/eventtype"
import { Table } from "../../src/model/table"
import { Rack } from "../../src/utils/rack"

describe("EventUtil", () => {
  it("Serialise and deserialise AimEvent", (done) => {
    let aim = new AimEvent()
    let event: GameEvent = aim
    let serialised = EventUtil.serialise(event)
    let deserialised = <AimEvent>EventUtil.fromSerialised(serialised)
    expect(deserialised.type).to.equal(EventType.AIM)
    done()
  })

  it("Serialise and deserialise AbortEvent", (done) => {
    let serialised = EventUtil.serialise(new AbortEvent())
    let deserialised = EventUtil.fromSerialised(serialised)
    expect(deserialised.type).to.equal(EventType.ABORT)
    done()
  })

  it("Serialise and deserialise WatchEvent", (done) => {
    let table = new Table(Rack.diamond())
    let serialised = EventUtil.serialise(new WatchEvent(table.serialise()))
    let deserialised = EventUtil.fromSerialised(serialised)
    expect(deserialised.type).to.equal(EventType.WATCHAIM)
    done()
  })

  it("Throw on unknown event", (done) => {
    expect(() => EventUtil.fromSerialised("{}")).to.throw()
    done()
  })
})
