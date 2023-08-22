import { Input } from "./input"
import interact from "interactjs"

/**
 * Maintains a map of pressed keys.
 *
 * Produces events while key is pressed with elapsed time
 */
export class Keyboard {
  pressed = {}
  released = {}

  getEvents() {
    const keys = Object.keys(this.pressed)
      .filter((key) => !/Shift/.test(key))
      .filter((key) => !/Control/.test(key))
    const shift = Object.keys(this.pressed).some((key) => /Shift/.test(key))
    const control = Object.keys(this.pressed).some((key) => /Control/.test(key))
    const result: Input[] = []

    keys.forEach((k) => {
      const t = performance.now() - this.pressed[k]
      result.push(new Input(control ? t / 3 : t, shift ? "Shift" + k : k))
      if (k != "Space") {
        this.pressed[k] = performance.now()
      }
    })

    Object.keys(this.released).forEach((key) =>
      result.push(new Input(this.released[key], key + "Up"))
    )

    this.released = {}
    return result
  }

  constructor(element: HTMLDivElement) {
    this.addHandlers(element)
  }

  keydown = (e) => {
    if (this.pressed[e.code] == null) {
      this.pressed[e.code] = performance.now()
    }
    e.stopImmediatePropagation()
    if (e.key !== "F12") {
      e.preventDefault()
    }
  }

  keyup = (e) => {
    this.released[e.code] = performance.now() - this.pressed[e.code]
    delete this.pressed[e.code]
    e.stopImmediatePropagation()
    if (e.key !== "F12") {
      e.preventDefault()
    }
  }

  mousetouch = (e) => {
    const dx = e.delta.x
    if (this.released["movementX"]) {
      this.released["movementX"] += dx
    } else {
      this.released["movementX"] = dx
    }
  }

  private addHandlers(element: HTMLDivElement) {
    element.addEventListener("keydown", this.keydown)
    element.addEventListener("keyup", this.keyup)
    element.contentEditable = "true"
    element.focus()
    interact(element).draggable({
      listeners: {
        move: (e) => {
          this.mousetouch(e)
        },
      },
    })
  }
}
