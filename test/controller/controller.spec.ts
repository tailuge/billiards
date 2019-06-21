import "mocha"
import { expect } from "chai"
import { Controller } from "../../src/controller/base";
import { Aim } from "../../src/controller/aim";
import { AimEvent } from "../../src/events/aimevent";
import { AbortEvent } from "../../src/events/abortevent";
import { GameEvent } from "../../src/events/gameevent";


describe("Controller", () => {
  it("Can handle events", done => {
      let controller:Controller = new Aim()
      let event:GameEvent = new AbortEvent()

      expect(controller.handleEvent(event)).to.be.not.null
      expect(controller.handleEvent(new AimEvent())).to.be.not.null
    done()
  })
})
