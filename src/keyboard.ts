export class Keyboard {
  pressed = {}
  rate = 0
  scale = 0.02
  public reportState: (state: String) => void

  public registerCallback(stateCallback) {
    this.reportState = stateCallback
  }

  constructor() {
    this.addHandlers()
  }

  keydown = (e) => {
      e = e || window.event
      this.pressed[e.keyCode] = true
      e.stopImmediatePropagation()
    }

  keyup = (e) => {
      e = e || window.event
      delete this.pressed[e.keyCode]
      this.rate = 0
      e.stopImmediatePropagation()
    }

  private addHandlers() {
    document.addEventListener("keydown", this.keydown)
    document.addEventListener("keyup", this.keyup)
  }

  applyKeys(t, table, camera) {
    if (this.pressed[39] && this.pressed[16]) {
      return this.side(t, table, camera, 1)
    }
    if (this.pressed[37] && this.pressed[16]) {
      return this.side(t, table, camera, -1)
    }
    if (this.pressed[39]) {
      return this.aim(t, table, camera, 1)
    }
    if (this.pressed[37]) {
      return this.aim(t, table, camera, -1)
    }
    if (this.pressed[38]) {
      return this.upDown(t, table, camera, 1)
    }
    if (this.pressed[40]) {
      return this.upDown(t, table, camera, -1)
    }
    if (this.pressed[32]) {
      if (table.allStationary()) {
        table.cue.hit(3)
        this.reportState(table.serialise())
        camera.mode = camera.afterHitView
      }
    }
    if (this.pressed[84]) {
      camera.mode = camera.topView
    }
  }

  aim(t, table, camera, dir) {
    this.rate += t * this.scale
    table.cue.moveToCueBall()
    table.cue.rotateAim(dir * this.rate)
    camera.mode = camera.aimView
  }

  upDown(t, table, camera, dir) {
    this.rate += t * this.scale
    table.cue.adjustHeight(dir * this.rate)
    camera.mode = camera.aimView
  }

  side(t, table, camera, dir) {
    this.rate += t * this.scale
    table.cue.adjustSide(-dir * this.rate)
    camera.mode = camera.aimView
  }
}
