import "mocha"
import { expect } from "chai"
import { Container } from "../../src/container/container"
import { GameEvent } from "../../src/events/gameevent"
import { initDom } from "../view/dom"

initDom()

describe("FourteenOne", () => {
  let container: Container
  let broadcastEvents: GameEvent[]
  const rule = "fourteenone"

  beforeEach(function (done) {
    container = new Container(undefined, (_) => {}, false, rule)
    broadcastEvents = []
    container.broadcast = (x) => broadcastEvents.push(x)
    done()
  })

  it("Fourteenone has 16 balls", (done) => {
    expect(container.table.balls).to.be.length(16)
    done()
  })
})
