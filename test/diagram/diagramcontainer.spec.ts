import { expect } from "chai"
import { DiagramContainer } from "../../src/diagram/diagramcontainer"
import { mathavanAdapter } from "../../src/model/physics/physics"
import { strongeAdapter } from "../../src/model/physics/stronge"

/**
 * The cushion model travels in the diagram state url, which the editor
 * republishes on every change. `DiagramContainer` reads it once at
 * construction, and `three.html` only ever needs that much because its Stronge
 * button reloads the page with the model in the query string. The editor
 * switches models in place instead, so a re-run has to pick the model back up
 * out of the state it is about to replay -- otherwise the toggle republishes
 * the state, the shot replays, and the trajectory is bit-identical because it
 * went through the same adapter as before.
 */
describe("DiagramContainer cushion model", () => {
  const shot = { diagram: true, init: [], shots: [] }
  const state = (cushionModel?: string) => {
    const params = new URLSearchParams()
    params.set("ruletype", "threecushion")
    if (cushionModel) params.set("cushionModel", cushionModel)
    params.set("state", JSON.stringify(shot))
    return `?${params.toString()}`
  }

  const stubCanvas = (cushionModel?: string) =>
    ({ dataset: { state: state(cushionModel) } }) as any

  const stubContainer = () => {
    const container: any = {
      eventQueue: [] as unknown[],
      table: {
        cushionModel: undefined as unknown,
        updateFromShortSerialised: () => {},
        freezeTraces: () => {},
        proximityIndicator: { hide: () => {} },
      },
      view: {
        scene: {},
        camera: { topView: {}, forceMode: () => {} },
      },
    }
    return container
  }

  // `replayButton` is the only entry point that mutates the running model, so a
  // container wired to a stub is enough to exercise it; nothing here builds a
  // real table or loads assets.
  const harness = (cushionModel?: string) => {
    const container = stubContainer()
    const diagram = new DiagramContainer(
      stubCanvas(cushionModel),
      "threecushion",
      JSON.stringify(shot)
    )
    diagram.container = container
    const button = document.createElement("button")
    diagram.replayButton(button)
    return { diagram, container, button }
  }

  it("takes the model from the state url on a re-run", (done) => {
    const { container, button } = harness("stronge")
    button.click()
    expect(container.table.cushionModel).to.equal(strongeAdapter)
    done()
  })

  it("returns to the default when the state names no model", (done) => {
    // The editor omits `cushionModel` for mathavan, so the absent case is the
    // one that has to fall back rather than keep whatever was set before.
    const { diagram, container, button } = harness("stronge")
    diagram.container.table.cushionModel = strongeAdapter

    const params = new URLSearchParams()
    params.set("state", JSON.stringify(shot))
    diagram.canvas3d.dataset.state = `?${params.toString()}`

    button.click()
    expect(container.table.cushionModel).to.equal(mathavanAdapter)
    done()
  })

  it("falls back to mathavan for an unrecognised model", (done) => {
    const { container, button } = harness("notAModel")
    button.click()
    expect(container.table.cushionModel).to.equal(mathavanAdapter)
    done()
  })

  it("leaves the model alone while a shot is in flight", (done) => {
    // The re-run is a no-op until the queue drains, and that has to cover the
    // model too: swapping the adapter mid-shot would change the cushion law
    // partway through a simulation that is already running.
    const { container, button } = harness("stronge")
    container.eventQueue.push({ pending: true })
    button.click()
    expect(container.table.cushionModel).to.be.undefined
    done()
  })
})
