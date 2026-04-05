import { BallTray } from "../../src/view/ball-tray"

describe("BallTray", () => {
  let tray: BallTray
  let container: any
  let trayList: HTMLElement

  beforeEach(() => {
    document.body.innerHTML = `
      <div id="ballTray" class="tray-container">
        <div id="trayLeft"></div>
        <div id="ballTrayList"></div>
        <div id="trayRight"></div>
      </div>
    `
    trayList = document.getElementById("ballTrayList")!
    container = {
      linkFormatter: {
        getReplayUri: jest.fn().mockReturnValue("replay-url"),
        getHiScoreUri: jest.fn().mockReturnValue("hiscore-url"),
      },
    }
    tray = new BallTray(container)
  })

  test("addShot groups consecutive pots", () => {
    // First pot
    tray.addShot(true, 1, [], {})
    expect(trayList.querySelectorAll(".break-group").length).toBe(1)
    expect(trayList.querySelectorAll(".ball-item").length).toBe(1)

    // Second pot
    tray.addShot(true, 1, [], {})
    expect(trayList.querySelectorAll(".break-group").length).toBe(1)
    expect(trayList.querySelectorAll(".ball-item").length).toBe(2)
  })

  test("addShot breaks group on miss", () => {
    // Pot
    tray.addShot(true, 1, [], {})
    // Miss
    tray.addShot(false, 0, [], {})
    expect(trayList.querySelectorAll(".break-group").length).toBe(1)
    expect(trayList.querySelectorAll(".ball-item").length).toBe(2)
    // Next pot should be in new group
    tray.addShot(true, 1, [], {})
    expect(trayList.querySelectorAll(".break-group").length).toBe(2)
  })

  test("addBreak creates new group", () => {
    tray.addBreak({}, 3)
    expect(trayList.querySelectorAll(".break-group").length).toBe(1)
    expect(trayList.querySelector(".break-group")?.innerHTML).toContain("hiscore-url")
  })

  test("reset clears all items", () => {
    tray.addShot(true, 1, [], {})
    tray.reset()
    expect(trayList.innerHTML).toBe("")
  })

  test("replay link events bubble, but other tray clicks stop", () => {
    tray.addShot(true, 1, [], {})
    const link = trayList.querySelector(".ball-item") as HTMLElement
    const nonLink = trayList.querySelector(".break-group") as HTMLElement
    const spy = jest.fn()
    document.body.addEventListener("click", spy)
    document.body.addEventListener("mousedown", spy)

    try {
      // Click on link should bubble
      link.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }))
      expect(spy).toHaveBeenCalledTimes(1)

      // Mousedown on link should bubble
      spy.mockClear()
      link.dispatchEvent(new MouseEvent("mousedown", { bubbles: true, cancelable: true }))
      expect(spy).toHaveBeenCalledTimes(1)

      // Mousedown on non-link tray element should NOT bubble
      spy.mockClear()
      nonLink.dispatchEvent(new MouseEvent("mousedown", { bubbles: true, cancelable: true }))
      expect(spy).not.toHaveBeenCalled()
    } finally {
      document.body.removeEventListener("click", spy)
      document.body.removeEventListener("mousedown", spy)
    }
  })
})
