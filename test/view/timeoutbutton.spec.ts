import { expect } from "chai"
import { TimeoutButton } from "../../src/view/timeoutbutton"

describe("TimeoutButton", () => {
  let button: HTMLButtonElement
  let timeoutButton: TimeoutButton
  let completed = false

  beforeEach(() => {
    button = document.createElement("button")
    completed = false
    timeoutButton = new TimeoutButton(button, {
      duration: 100,
      onComplete: () => {
        completed = true
      },
    })
    // Mock requestAnimationFrame
    globalThis.requestAnimationFrame = (callback: FrameRequestCallback) => {
      return setTimeout(() => callback(performance.now()), 16) as unknown as number
    }
    globalThis.cancelAnimationFrame = (id: number) => {
      clearTimeout(id as unknown as ReturnType<typeof setTimeout>)
    }
  })

  it("should start the timer and keep the button enabled", (done) => {
    timeoutButton.startTimer()
    expect(button.disabled).to.be.false
    expect(button.style.getPropertyValue("--timer-color")).to.equal("#10b981")

    setTimeout(() => {
      try {
        expect(completed).to.be.true
        done()
      } catch (e) {
        done(e)
      }
    }, 150)
  })

  it("should cancel the timer when the button is clicked", (done) => {
    timeoutButton.startTimer()
    button.click()

    setTimeout(() => {
      try {
        expect(completed).to.be.false
        expect(button.style.getPropertyValue("--sweep")).to.equal("0deg")
        done()
      } catch (e) {
        done(e)
      }
    }, 150)
  })

  it("should transition to critical color", (done) => {
    timeoutButton = new TimeoutButton(button, {
      duration: 100,
      criticalMs: 50,
    })
    timeoutButton.startTimer()

    setTimeout(() => {
      try {
        expect(button.style.getPropertyValue("--timer-color")).to.equal("#ef4444")
        done()
      } catch (e) {
        done(e)
      }
    }, 90)
  })

})
