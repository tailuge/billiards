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
})
