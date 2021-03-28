import { Input } from "./input"

/**
 * Maintains a map of pressed keys.
 *
 * Produces events while key is pressed.
 */
export class Keyboard {
  pressed = {}
  released = {}

  getEvents(t: number) {
    let keys = Object.keys(this.pressed)
      .filter((key) => !/.*Shift.*/.test(key))
      .filter((key) => !/.*Control.*/.test(key))
    let shift = Object.keys(this.pressed).some((key) => /.*Shift.*/.test(key))
    let control = Object.keys(this.pressed).some((key) =>
      /.*Control.*/.test(key)
    )
    let result = keys.map(
      (key) => new Input(control ? t / 3 : t, shift ? "Shift" + key : key)
    )
    Object.keys(this.released).forEach((key) =>
      result.push(new Input(t, key + "Up"))
    )
    this.released = {}
    return result
  }

  constructor() {
    this.addHandlers()
  }

  keydown = (e) => {
    e = e || window.event
    this.pressed[e.code] = true
    e.stopImmediatePropagation()
    if (e.key !== "F12") {
      e.preventDefault()
    }
  }

  keyup = (e) => {
    e = e || window.event
    delete this.pressed[e.code]
    this.released[e.code] = true
    e.stopImmediatePropagation()
    if (e.key !== "F12") {
      e.preventDefault()
    }
  }

  private addHandlers() {
    document.addEventListener("keydown", this.keydown)
    document.addEventListener("keyup", this.keyup)
  }
}
