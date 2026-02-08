import { expect } from "chai"
import { initDom } from "./dom"
import { fireEvent } from "@testing-library/dom"
import { Container } from "../../src/container/container"
import { Menu } from "../../src/view/menu"
import { Assets } from "../../src/view/assets"

initDom()

let container: Container

beforeEach(function (done) {
  container = new Container(
    document.getElementById("viewP1"),
    (_) => {},
    Assets.localAssets()
  )
  new Menu(container)
  done()
})

describe("Menu", () => {
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
})
