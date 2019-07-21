import "mocha"
import { expect } from "chai"
import { AimEvent } from "../../src/events/aimevent"
import { AbortEvent } from "../../src/events/abortevent"
import { GameEvent } from "../../src/events/gameevent"
import { EventUtil } from "../../src/events/eventutil"
import { EventType } from "../../src/events/eventtype"

describe("EventUtil", () => {
  it("Serialise and deserialise AimEvent", done => {
    let aim = new AimEvent()
    aim.dir.x = 0.5
    let event: GameEvent = aim
    let serialised = EventUtil.serialise(event)
    let deserialised = <AimEvent>EventUtil.fromSerialised(serialised)
    expect(deserialised.type).to.equal(EventType.AIM)
    expect(deserialised.dir).to.deep.equal(aim.dir)
    done()
  })

  it("Serialise and deserialise AbortEvent", done => {
    let serialised = EventUtil.serialise(new AbortEvent())
    let deserialised = EventUtil.fromSerialised(serialised)
    expect(deserialised.type).to.equal(EventType.ABORT)
    done()
  })

  it("Throw on unknown event", done => {
    expect(() => EventUtil.fromSerialised("{}")).to.throw()
    done()
  })
})
