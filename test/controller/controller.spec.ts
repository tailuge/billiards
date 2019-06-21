import "mocha"
import { expect } from "chai"
import { Controller } from "../../src/controller/controller";
import { Aim } from "../../src/controller/aim";
import { End } from "../../src/controller/end";
import { AbortEvent } from "../../src/events/abortevent";
import { GameEvent } from "../../src/events/gameevent";


describe("Controller", () => {
  it("Abort takes Aim to End", done => {
      let controller:Controller = new Aim()
      let event:GameEvent = new AbortEvent()
      expect(controller.handleEvent(event)).to.be.an.instanceof(End)
    done()
  })
})
