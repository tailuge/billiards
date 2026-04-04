import { expect } from "chai"
import { Recorder } from "../../src/events/recorder"
import { Container } from "../../src/container/container"
import { HitEvent } from "../../src/events/hitevent"
import { initDom, canvas3d } from "../view/dom"
import { Outcome } from "../../src/model/outcome"
import { Assets } from "../../src/view/assets"

initDom()

describe("Recorder", () => {
  let container: Container

  beforeEach(function (done) {
    container = new Container({
      element: canvas3d,
      log: (_) => {},
      assets: Assets.localAssets(),
    })
    done()
  })

  it("record events", (done) => {
    const recorder = new Recorder(container, container.linkFormatter)
    const event: HitEvent = new HitEvent(container.table.serialise())
    recorder.record(event)
    expect(recorder.wholeGame()).to.be.not.null
    done()
  })

  it("show break messages via ball tray", (done) => {
    const recorder = new Recorder(container, container.linkFormatter)
    const event: HitEvent = new HitEvent(container.table.serialise())
    recorder.record(event)
    const outcome = container.table.outcome
    outcome.push(Outcome.pot(container.table.balls[1], 1))
    recorder.updateBreak(
      outcome,
      container.rules.isPartOfBreak(outcome),
      container.rules.isEndOfGame(outcome)
    )
    // One entry in tray, none in eventQueue for lastShotLink/breakLink
    expect(container.ballTray.entries).to.have.length(1)

    recorder.record(event)
    outcome.push(Outcome.pot(container.table.balls[2], 1))
    recorder.updateBreak(
      outcome,
      container.rules.isPartOfBreak(outcome),
      container.rules.isEndOfGame(outcome)
    )
    expect(container.ballTray.entries).to.have.length(2)

    recorder.record(event)
    container.table.outcome = []
    recorder.updateBreak(
      container.table.outcome,
      container.rules.isPartOfBreak(container.table.outcome),
      container.rules.isEndOfGame(container.table.outcome)
    )
    // End of break should add another entry to tray
    expect(container.ballTray.entries).to.have.length(4)
    done()
  })
})
