import { expect } from "chai"
import { initDom } from "./dom"
import { fireEvent } from "@testing-library/dom"
import { Container } from "../../src/container/container"
import { Menu } from "../../src/view/menu"
import { Assets } from "../../src/view/assets"
import { Session } from "../../src/network/client/session"
import { WatchAim } from "../../src/controller/watchaim"

initDom()

let container: Container

beforeEach(function (done) {
  container = new Container({
    element: document.getElementById("viewP1"),
    log: (_) => {},
    assets: Assets.localAssets(),
  })
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

  it("camera in WatchAim mode skips directly to zoomed-out aim view (aimz)", (done) => {
    // Set aspect ratio manually to prevent NaN inside JSDOM environment
    container.view.camera.camera.aspect = 1
    container.view.camera.camera.updateProjectionMatrix()

    const balls = container.table.balls
    for (let i = 0; i < balls.length; i++) {
      const b = balls[i]
      b.ballmesh = undefined as any
      if (i >= 2) {
        b.state = "InPocket" as any
      }
    }
    if (balls.length > 1) {
      balls[0].pos.set(0, 0, 0)
      balls[1].pos.set(1.0, 1.0, 0)
    }

    container.controller = new WatchAim(container)
    expect(container.view.camera.mode).to.be.equal(
      container.view.camera.topView
    )

    const toggleview = document.getElementById("camera") as HTMLButtonElement
    fireEvent.click(toggleview)

    expect(container.view.camera.mode).to.be.equal(
      container.view.camera.aimView
    )
    expect(container.view.camera.isZoomedOut).to.be.true
    expect(container.view.camera.savedDistance).to.not.be.undefined
    done()
  })

  it("concede notification buttons clear the notification", (done) => {
    const concede = document.getElementById("concede") as HTMLButtonElement
    fireEvent.click(concede)

    const notification = document.getElementById("notification")
    expect(notification?.innerHTML).to.contain("Concede Game")

    const playOn = document.querySelector(
      "[data-notification-action='concede-cancel']"
    ) as HTMLButtonElement
    fireEvent.click(playOn)

    expect(notification?.innerHTML).to.equal("")
    done()
  })

  it("concede confirm in bot mode triggers game over", (done) => {
    Session.init("test-client", "TestPlayer", "test-table", false, true)
    const concede = document.getElementById("concede") as HTMLButtonElement
    fireEvent.click(concede)

    const confirm = document.querySelector(
      "[data-notification-action='concede-confirm']"
    ) as HTMLButtonElement
    fireEvent.click(confirm)

    expect(container.controller.name).to.equal("End")
    const notification = document.getElementById("notification")
    expect(notification?.innerHTML).to.contain("YOU LOST")
    expect(notification?.innerHTML).to.contain("Lostber 🦞")

    Session.reset()
    done()
  })
})
