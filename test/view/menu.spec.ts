import { expect } from "chai"
import { initDom } from "./dom"
import { fireEvent } from "@testing-library/dom"
import { Container } from "../../src/container/container"
import { Menu } from "../../src/view/menu"
import { Assets } from "../../src/view/assets"
import { Session } from "../../src/network/client/session"

let container: Container

beforeEach(function (done) {
  initDom()
  container = new Container({
    element: document.getElementById("viewP1"),
    log: (_) => {},
    assets: Assets.localAssets(),
  })
  new Menu(container)
  done()
})

describe("Menu", () => {
  it("menu opens the secondary controls without opening help", (done) => {
    const menu = document.getElementById("menu") as HTMLElement
    const dropdown = document.getElementById(
      "menuDropdown"
    ) as HTMLDetailsElement
    const helpOverlay = document.getElementById("helpOverlay")

    expect(dropdown.open).to.be.false
    fireEvent.click(menu)

    expect(dropdown.open).to.be.true
    expect(helpOverlay?.hasAttribute("hidden")).to.be.true
    done()
  })

  it("help button opens and close button hides the help overlay", (done) => {
    const help = document.getElementById("help") as HTMLButtonElement
    const overlay = document.getElementById("helpOverlay")
    const iframe = overlay?.querySelector("iframe")

    expect(help.textContent?.trim()).to.equal("ℹ️")
    fireEvent.click(help)

    expect(overlay?.hasAttribute("hidden")).to.be.false
    expect(iframe?.getAttribute("src")).to.equal("help.html")

    fireEvent.click(document.getElementById("helpClose") as HTMLButtonElement)
    expect(overlay?.hasAttribute("hidden")).to.be.true
    done()
  })

  it("visibility controls are independent", (done) => {
    const menu = new Menu(container)
    const share = document.getElementById("share") as HTMLButtonElement
    const diagram = document.getElementById("diagram") as HTMLButtonElement
    const concede = document.getElementById("concede") as HTMLButtonElement
    const analysis = document.getElementById("analysis") as HTMLButtonElement

    // Reset all to hidden to test independent visibility transitions
    menu.setShareVisible(false)
    menu.setDiagramVisible(false)
    menu.setConcedeVisible(false)
    menu.setAnalysisVisible(false)

    menu.setShareVisible(true)
    expect(share.hidden).to.be.false
    expect(diagram.hidden).to.be.true
    expect(concede.hidden).to.be.true
    expect(analysis.hidden).to.be.true

    menu.setDiagramVisible(true)
    expect(share.hidden).to.be.false
    expect(diagram.hidden).to.be.false
    expect(concede.hidden).to.be.true
    expect(analysis.hidden).to.be.true

    menu.setConcedeVisible(true)
    expect(concede.hidden).to.be.false
    expect(analysis.hidden).to.be.true

    menu.setAnalysisVisible(true)
    expect(analysis.hidden).to.be.false
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

  it("concede button is visible in single player mode by default", (done) => {
    const concede = document.getElementById("concede") as HTMLButtonElement
    // Since container starts in single player mode, it should be visible immediately after container construction
    expect(concede.hidden).to.be.false
    expect(concede.disabled).to.be.false
    done()
  })

  it("concede confirm in single player mode triggers game over and shows lobby button", (done) => {
    expect(container.isSinglePlayer).to.be.true

    // Update controller to ensure the button is visible and active
    container.updateController(container.controller)

    const concede = document.getElementById("concede") as HTMLButtonElement
    fireEvent.click(concede)

    const notification = document.getElementById("notification")
    expect(notification?.innerHTML).to.contain("Concede Game")
    expect(notification?.innerHTML).to.contain("game will end")

    const confirm = document.querySelector(
      "[data-notification-action='concede-confirm']"
    ) as HTMLButtonElement
    fireEvent.click(confirm)

    expect(container.controller.name).to.equal("End")
    expect(notification?.innerHTML).to.contain("YOU LOST")
    expect(notification?.innerHTML).to.contain("data-notification-action=\"lobby\"")
    expect(notification?.innerHTML).to.contain("Back to Lobby")
    expect(notification?.innerHTML).to.contain("New Game")

    done()
  })
})
