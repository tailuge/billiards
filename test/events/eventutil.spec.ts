import "mocha"
import { expect } from "chai"
import { AimEvent } from "../../src/events/aimevent";
import { GameEvent } from "../../src/events/gameevent";
import { EventUtil } from "../../src/events/eventutil";
import { EventType } from "../../src/events/eventtype";

describe("EventUtil", () => {
    it("Serialise and deserialise AimEvent", done => {
        let event: GameEvent = new AimEvent()
        expect(EventUtil.fromSerialised(EventUtil.serialise(event)).type).to.equal(EventType.AIM)
        done()
    })

    it("Throw on unknown event", done => {
        expect(() => EventUtil.fromSerialised("{}")).to.throw()
        done()
    })

})
