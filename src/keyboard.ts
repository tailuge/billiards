export class Keyboard {
  pressed = {}
  rate = 0

  constructor() {
    this.addHandlers()
  }

  private addHandlers() {
    document.addEventListener("keydown", e => {
      e = e || window.event
      this.pressed[e.keyCode] = true
    })

    document.addEventListener("keyup", e => {
      e = e || window.event
      delete this.pressed[e.keyCode]
      this.rate = 0
    })
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
        camera.mode = camera.afterHitView
      }
    }
    if (this.pressed[84]) {
      camera.mode = camera.topView
    }
  }

  aim(t, table, camera, dir) {
    this.rate += t / 50000
    table.cue.moveToCueBall()
    table.cue.rotateAim(dir * this.rate)
    camera.mode = camera.aimView
  }

  upDown(t, table, camera, dir) {
    this.rate += t / 50000
    table.cue.adjustHeight(dir * this.rate)
    camera.mode = camera.aimView
  }

  side(t, table, camera, dir) {
    this.rate += t / 50000
    table.cue.adjustSide(-dir * this.rate)
    camera.mode = camera.aimView
  }
}
