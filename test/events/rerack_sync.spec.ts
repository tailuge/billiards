import { expect } from "chai"
import { Container } from "../../src/container/container"
import { Ball, State } from "../../src/model/ball"
import { RerackEvent } from "../../src/events/rerackevent"
import { EventUtil } from "../../src/events/eventutil"
import { Assets } from "../../src/view/assets"
import { initDom } from "../view/dom"
import { Vector3 } from "three"

initDom()

describe("RerackEvent Synchronization", () => {
  let container: Container

  beforeEach(() => {
    Ball.id = 0
    container = new Container(
      undefined,
      (_: any) => {},
      Assets.localAssets(),
      "nineball"
    )
  })

  it("should correctly sync 9-ball respot via serialization", () => {
    const nineBall = container.table.balls.find((b) => b.label === 9)!
    
    // Simulate 9-ball potted on Bruce's machine
    nineBall.state = State.InPocket
    nineBall.pos.set(0, 0, -10)

    // Rozella's respot info
    const respotPos = new Vector3(1, 2, 0)
    const respotEvent = RerackEvent.fromJson({
      balls: [{ id: nineBall.id, pos: respotPos }]
    })

    // Serialise (as if sending over network)
    const serialised = EventUtil.serialise(respotEvent)
    
    // Deserialise (as if receiving on Bruce's machine)
    const receivedEvent = EventUtil.fromSerialised(serialised) as RerackEvent

    // Apply to Bruce's controller
    receivedEvent.applyToController(container.controller)

    // Verify 9-ball is respotted
    expect(nineBall.pos.x).to.equal(respotPos.x)
    expect(nineBall.pos.y).to.equal(respotPos.y)
    expect(nineBall.pos.z).to.equal(respotPos.z)
    expect(nineBall.state).to.equal(State.Stationary)
  })
})
