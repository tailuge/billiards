import "mocha"
import { expect } from "chai"
import { Recorder } from "../../src/events/recorder"
import { Container } from "../../src/container/container"
import { HitEvent } from "../../src/events/hitevent"
import { initDom, canvas3d } from "../view/dom"
import { Outcome } from "../../src/model/outcome"

initDom()

describe("Recorder", () => {
  let container: Container

  beforeEach(function (done) {
    container = new Container(canvas3d, (_) => {})
    done()
  })

  it("record events", (done) => {
    const recorder = new Recorder(container)
    const event: HitEvent = new HitEvent(container.table.serialise())
    recorder.record(event)
    expect(recorder.replayGame()).to.be.not.null
    const replay = recorder.replayGame()
    expect(JSON.stringify(recorder.replayLastShot())).to.equals(
      JSON.stringify(replay)
    )
    done()
  })

  it("show break messages", (done) => {
    const recorder = new Recorder(container)
    const event: HitEvent = new HitEvent(container.table.serialise())
    recorder.record(event)
    container.table.outcome.push(Outcome.pot(container.table.balls[1], 1))
    recorder.updateBreak(container.table.outcome)
    expect(container.eventQueue).to.be.length(1)
    recorder.record(event)
    container.table.outcome.push(Outcome.pot(container.table.balls[2], 1))
    recorder.updateBreak(container.table.outcome)
    expect(container.eventQueue).to.be.length(2)
    recorder.record(event)
    container.table.outcome = []
    recorder.updateBreak(container.table.outcome)
    expect(container.eventQueue).to.be.length(4)
    done()
  })
})
