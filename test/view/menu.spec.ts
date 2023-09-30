import "mocha"
import { expect } from "chai"
import { initDom } from "./dom"
import { Sliders } from "../../src/view/sliders"
import { fireEvent } from "@testing-library/dom"
import { R } from "../../src/model/physics/constants"
import { Container } from "../../src/container/container"
import { Menu } from "../../src/view/menu"

initDom()

let container: Container
let menu: Menu

beforeEach(function (done) {
  container = new Container(document.getElementById("viewP1"), (_) => {})
  const menu = new Menu(container)
  done()
})

describe("Menu", () => {
  it("togglemenu", (done) => {
    const menu = new Menu(container)
    const togglemenu = document.getElementById(
      "togglemenu"
    ) as HTMLButtonElement
    fireEvent.click(togglemenu, { target: { value: 1 } })
    expect(menu.menu.visibility).to.be.equal("visible")
    const dismiss = document.getElementById("dismiss") as HTMLButtonElement
    fireEvent.click(dismiss, { target: { value: 1 } })
    expect(menu.menu.visibility).to.be.equal("hidden")
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
})
