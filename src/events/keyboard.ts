import { Input } from "./input"

/**
 * Maintains a map of pressed keys.
 *
 * Produces events while key is pressed.
 */
export class Keyboard {
  pressed = {}

  getEvents(t: number) {
      let keys = Object.keys(this.pressed).filter(key => !/.*Shift.*/.test(key))
      let shift = Object.keys(this.pressed).some(key => /.*Shift.*/.test(key))
      return keys.map(key => new Input(t, shift ? "Shift"+key: key))
  }

  constructor() {
    this.addHandlers()
  }

  keydown = e => {
    e = e || window.event
    this.pressed[e.code] = true
    e.stopImmediatePropagation()
  }

  keyup = e => {
    e = e || window.event
    delete this.pressed[e.code]
    e.stopImmediatePropagation()
  }

  private addHandlers() {
    document.addEventListener("keydown", this.keydown)
    document.addEventListener("keyup", this.keyup)
  }


}
