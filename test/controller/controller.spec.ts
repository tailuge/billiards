import "mocha"
import { expect } from "chai"
import { Base } from "../../src/controller/base";
import { Aim } from "../../src/controller/aim";
import { AimEvent } from "../../src/events/aimevent";
import { AbortEvent } from "../../src/events/abortevent";
import { GameEvent } from "../../src/events/gameevent";


describe("Controller", () => {
  it("Can handle events", done => {
      let controller:Base = new Aim()
      let event:GameEvent = new AbortEvent()
      controller.handleEvent(event)
      controller.handleEvent(new AimEvent())
      expect(controller).to.be.not.null
    done()
  })
})
