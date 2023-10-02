import "mocha"
import { expect } from "chai"
import { initDom } from "./dom"
import { fireEvent } from "@testing-library/dom"
import { Container } from "../../src/container/container"
import { Menu } from "../../src/view/menu"

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

  it("toggleview", (done) => {
    const toggleview = document.getElementById(
      "toggleview"
    ) as HTMLButtonElement
    expect(container.view.camera.mode).to.be.equal(
      container.view.camera.topView
    )
    fireEvent.click(toggleview, { target: { value: 1 } })
    expect(container.view.camera.mode).to.be.equal(
      container.view.camera.aimView
    )
    done()
  })

  it("replay mode", (done) => {
    menu.replayMode("someurl")
    const togglemenu = document.getElementById(
      "togglemenu"
    ) as HTMLButtonElement
    fireEvent.click(togglemenu, { target: { value: 1 } })
    expect(container.eventQueue).to.be.length(1)
    done()
  })
})
