import "mocha"
import { expect } from "chai"
import { Aim } from "../../src/controller/aim"
import { Base } from "../../src/controller/base"
import { AimEvent } from "../../src/events/aimevent";

describe("Controller", () => {
  it("Serialise events", done => {
      var controller:Base = new Aim()
      let e = new AimEvent()
      controller.handleGameEvent(e);
      expect(controller).to.be.not.null
      console.log(e)
      console.log(JSON.stringify(e))
      const obj = JSON.parse(JSON.stringify(e)) as AimEvent
      console.log(obj)
      console.log(JSON.stringify(obj))

    done()
  })
})
