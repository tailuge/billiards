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

  it("does not record hit history windows", () => {
    const recorder = new Recorder(container, container.linkFormatter)
    const event: HitEvent = new HitEvent(container.table.serialiseHit())
    event.tablejson.historyWindow = [
      {
        shotIndex: 0,
        event: { aim: { pos: { x: 1, y: 2, z: 0 } } },
        state: [1, 2, 3, 4],
      },
    ]

    recorder.record(event)

    expect(recorder.shots[0]).to.deep.equal(event.tablejson.aim)
    expect((recorder.shots[0] as any).historyWindow).to.be.undefined
  })

  it("show break messages via ball tray", (done) => {
    const recorder = new Recorder(container, container.linkFormatter)
    const event: HitEvent = new HitEvent(container.table.serialise())
    recorder.record(event)
    const outcome = container.table.outcome
    outcome.push(
      Outcome.pot(container.table.balls[1], 1),
      Outcome.pot(container.table.balls[2], 1)
    )
    recorder.updateBreak(
      outcome,
      container.rules.isPartOfBreak(outcome),
      container.rules.isEndOfGame(outcome)
    )
    // One entry in tray, none in eventQueue for lastShotLink/breakLink
    expect(container.ballTray.entries).to.have.length(1)

    recorder.record(event)
    outcome.push(Outcome.pot(container.table.balls[3], 1))
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
    // End of break should add another entry to tray (break score entry skipped since score=1)
    expect(container.ballTray.entries).to.have.length(3)
    done()
  })
})
