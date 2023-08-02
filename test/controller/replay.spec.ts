import "mocha"
import { expect } from "chai"
import { Container } from "../../src/controller/container"
import { EventUtil } from "../../src/events/eventutil"
import { BreakEvent } from "../../src/events/breakevent"
import { GameEvent } from "../../src/events/gameevent"
import { Replay } from "../../src/controller/replay"
import { PlaceBall } from "../../src/controller/placeball"

describe("Controller Replay", () => {
  let container: Container
  let broadcastEvents: GameEvent[]

  beforeEach(function (done) {
    container = new Container(undefined, (_) => {})
    broadcastEvents = []
    container.broadcast = (x) =>
      broadcastEvents.push(EventUtil.fromSerialised(x))
    done()
    container.isSinglePlayer = true
  })

  it("BreakEvent takes Init to PlaceBall", (done) => {
    container.eventQueue.push(new BreakEvent())
    container.processEvents()
    expect(container.controller).to.be.an.instanceof(PlaceBall)
    done()
  })

  it("BreakEvent with state takes Init to Replay", (done) => {
    const state = {
      init: [
        -11, 0, 10.727, 0.007, 11.721, 0.532, 11.683, -0.536, 12.632, -0.008,
        12.672, -1.114, 12.677, 1.108, 13.613, 0.572, 13.593, -0.57, 14.547,
        0.007,
      ],
      shots: [
        {
          type: "AIM",
          verticalOffset: 0,
          sideOffset: 0,
          angle: 0,
          power: 3.996,
          pos: [Object],
          spinOnly: false,
        },
      ],
    }

    container.eventQueue.push(new BreakEvent(state.init, state.shots))
    container.processEvents()
    expect(container.controller).to.be.an.instanceof(Replay)
    done()
  })
})
