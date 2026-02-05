import { expect } from "chai"
import { Container } from "../../src/container/container"
import { HitEvent } from "../../src/events/hitevent"
import { RerackEvent } from "../../src/events/rerackevent"
import { PlaceBallEvent } from "../../src/events/placeballevent"
import { initDom, canvas3d } from "../view/dom"
import { Assets } from "../../src/view/assets"
import { zero } from "../../src/utils/utils"

initDom()

describe("Recorder Hook in Container", () => {
  let container: Container

  beforeEach(function (done) {
    container = new Container(canvas3d, () => {}, Assets.localAssets())
    done()
  })

  it("should record HitEvent automatically when processed by Container", (done) => {
    const tableStateBefore = container.table.shortSerialise()
    const event = new HitEvent(container.table.serialise())

    container.eventQueue.push(event)
    container.processEvents()

    expect(container.recorder.shots).to.have.length(1)
    expect(container.recorder.states).to.have.length(1)
    expect(container.recorder.states[0]).to.deep.equal(tableStateBefore)
    // For HitEvent, we record the "aim" part
    expect(container.recorder.shots[0]).to.deep.equal(event.tablejson.aim)
    done()
  })

  it("should record RerackEvent automatically when processed by Container", (done) => {
    const tableStateBefore = container.table.shortSerialise()
    const event = RerackEvent.fromJson({ balls: [] })

    container.eventQueue.push(event)
    container.processEvents()

    expect(container.recorder.shots).to.have.length(1)
    expect(container.recorder.states).to.have.length(1)
    expect(container.recorder.states[0]).to.deep.equal(tableStateBefore)
    expect(container.recorder.shots[0]).to.equal(event)
    done()
  })

  it("should record PlaceBallEvent automatically when processed by Container", (done) => {
    const tableStateBefore = container.table.shortSerialise()
    const event = new PlaceBallEvent(zero)

    container.eventQueue.push(event)
    container.processEvents()

    expect(container.recorder.shots).to.have.length(1)
    expect(container.recorder.states).to.have.length(1)
    expect(container.recorder.states[0]).to.deep.equal(tableStateBefore)
    expect(container.recorder.shots[0]).to.equal(event)
    done()
  })
})
