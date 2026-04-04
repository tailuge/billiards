import { Container } from "../../src/container/container"
import { BallTray } from "../../src/view/ball-tray"

describe("BallTray", () => {
  let container: any
  let ballTray: BallTray

  beforeEach(() => {
    document.body.innerHTML = `
      <div id="ballTray">
        <div class="ball-tray-collapsed"></div>
        <div class="ball-tray-expanded" hidden></div>
      </div>
    `
    container = {
      linkFormatter: {
        getReplayUri: jest.fn().mockReturnValue("replay-url"),
        getHiScoreUri: jest.fn().mockReturnValue("hiscore-url"),
      },
    }
    ballTray = new BallTray(container)
  })

  test("should add a shot to the tray", () => {
    const state = { shots: [] }
    ballTray.addShot(false, 1, [{ ballmesh: { color: { getHexString: () => "ffffff" } } }], state)
    expect(ballTray.entries.length).toBe(1)
    expect(ballTray.entries[0].label).toBe("1 pot")
    expect(ballTray.entries[0].replayUri).toBe("replay-url")
  })

  test("should add a break to the tray with high score link if score >= 2", () => {
    ballTray.addBreak({}, 2)
    expect(ballTray.entries.length).toBe(1)
    expect(ballTray.entries[0].label).toBe("break(2)")
    expect(ballTray.entries[0].icon).toBe("⬤x2")
    expect(ballTray.entries[0].hiScoreUri).toBe("hiscore-url")
  })

  test("should not add high score link if score < 2", () => {
    ballTray.addBreak({}, 1)
    expect(ballTray.entries[0].hiScoreUri).toBeUndefined()
  })

  test("should toggle expanded state", () => {
    expect(ballTray.expanded).toBe(false)
    ballTray.toggle()
    expect(ballTray.expanded).toBe(true)
    const expandedEl = document.querySelector(".ball-tray-expanded") as HTMLElement
    expect(expandedEl.hidden).toBe(false)
    expect(expandedEl.style.display).toBe("flex")
  })

  test("should reset entries", () => {
    ballTray.addShot(false, 1, [], {})
    ballTray.reset()
    expect(ballTray.entries.length).toBe(0)
    expect(ballTray.expanded).toBe(false)
  })

  test("should handle click events and stop propagation", () => {
    const collapsed = document.querySelector(".ball-tray-collapsed") as HTMLElement
    const expanded = document.querySelector(".ball-tray-expanded") as HTMLElement

    const event = new MouseEvent("click", { bubbles: true, cancelable: true })
    const spy = jest.spyOn(event, "stopPropagation")

    collapsed.dispatchEvent(event)
    expect(spy).toHaveBeenCalled()
    expect(ballTray.expanded).toBe(true)

    expanded.dispatchEvent(event)
    expect(spy).toHaveBeenCalledTimes(2)
  })

  test("should handle close button click", () => {
    ballTray.toggle() // expand first
    const closeBtn = document.querySelector(".ball-tray-close") as HTMLElement
    const event = new MouseEvent("click", { bubbles: true, cancelable: true })
    closeBtn.dispatchEvent(event)
    expect(ballTray.expanded).toBe(false)
  })

  test("should update history container if header already exists", () => {
    ballTray.toggle() // first render creates header
    ballTray.addShot(false, 1, [], {}) // add another shot
    // toggle again to re-render (it's already expanded, so just calling render via addShot was enough)
    const history = document.querySelector(".ball-tray-history") as HTMLElement
    expect(history.querySelectorAll(".shot-row").length).toBe(1)

    ballTray.addShot(false, 2, [], {})
    expect(history.querySelectorAll(".shot-row").length).toBe(2)
  })
})
