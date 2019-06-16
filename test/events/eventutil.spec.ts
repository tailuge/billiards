import "mocha"
import { expect } from "chai"
import { AimEvent } from "../../src/events/aimevent";
import { GameEvent } from "../../src/events/gameevent";
import { EventUtil } from "../../src/events/eventutil";
import { EventType } from "../../src/events/eventtype";

describe("EventUtil", () => {
    it("Serialise and deserialise AimEvent", done => {
        let aim = new AimEvent()
        let event: GameEvent = aim
        aim.x = 5;
        let serialised = EventUtil.serialise(event)
        expect(EventUtil.fromSerialised(serialised).type).to.equal(EventType.AIM)
        done()
    })

    it("Throw on unknown event", done => {
        expect(() => EventUtil.fromSerialised("{}")).to.throw()
        done()
    })

})
