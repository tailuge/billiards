import "mocha"
import { expect } from "chai"
import { initDom } from "./dom"
import { fireEvent } from "@testing-library/dom"
import { Container } from "../../src/container/container"
import { Menu } from "../../src/view/menu"
import { BreakEvent } from "../../src/events/breakevent"

initDom()

let container: Container
let menu: Menu

beforeEach(function (done) {
  container = new Container(document.getElementById("viewP1"), (_) => {})
  menu = new Menu(container)
  done()
})

describe("Menu", () => {
  it("togglemenu", (done) => {
    const togglemenu = document.getElementById(
      "togglemenu"
    ) as HTMLButtonElement
    fireEvent.click(togglemenu, { target: { value: 1 } })
    expect(menu.menu.display).to.be.equal("flex")
    fireEvent.click(togglemenu, { target: { value: 1 } })
    expect(menu.menu.display).to.be.equal("none")
    done()
  })

  it("camera", (done) => {
    const toggleview = document.getElementById("camera") as HTMLButtonElement
    expect(container.view.camera.mode).to.be.equal(
      container.view.camera.topView
    )
    fireEvent.click(toggleview, { target: { value: 1 } })
    expect(container.view.camera.mode).to.be.equal(
      container.view.camera.aimView
    )
    done()
  })

  it("replay mode shorten url", (done) => {
    menu.replayMode("someurl", new BreakEvent(null, []))
    const togglemenu = document.getElementById("share") as HTMLButtonElement
    fireEvent.click(togglemenu, { target: { value: 1 } })
    expect(container.eventQueue).to.be.length(1)
    done()
  })

  it("redo button", (done) => {
    menu.replayMode("someurl", new BreakEvent(null, []))
    const redo = document.getElementById("redo") as HTMLButtonElement
    fireEvent.click(redo, { target: { value: 1 } })
    expect(container.eventQueue).to.be.length(2)
    done()
  })

  it("replay button", (done) => {
    menu.replayMode("someurl", new BreakEvent(null, []))
    const redo = document.getElementById("replay") as HTMLButtonElement
    fireEvent.click(redo, { target: { value: 1 } })
    expect(container.eventQueue).to.be.length(2)
    done()
  })
})
