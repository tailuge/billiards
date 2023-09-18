import "mocha"
import { expect } from "chai"
import { AimEvent } from "../../src/events/aimevent"
import { Recorder } from "../../src/events/recorder"
import { Container } from "../../src/container/container"
import { HitEvent } from "../../src/events/hitevent"

describe("Recorder", () => {
  let container: Container

  beforeEach(function (done) {
    container = new Container(undefined, (_) => {})
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
})