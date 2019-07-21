import "mocha"
import { expect } from "chai"
import { Controller } from "../../src/controller/controller";
import { Container } from "../../src/controller/container";
import { Aim } from "../../src/controller/aim";
import { End } from "../../src/controller/end";
import { AbortEvent } from "../../src/events/abortevent";
import { GameEvent } from "../../src/events/gameevent";


describe("Controller", () => {
  it("Abort takes Aim to End", done => {
      let container = new Container("",_=>{})
      let controller:Controller = new Aim(container)
      let event:GameEvent = new AbortEvent()
      expect(event.applyToController(controller)).to.be.an.instanceof(End)
    done()
  })
})
