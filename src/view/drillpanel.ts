import { Container } from "../container/container"
import { Aim } from "../controller/aim"
import { PlaceAllBalls } from "../controller/placeallballs"
import { DrillReplay } from "../controller/drillreplay"
import { Drill } from "../controller/rules/drill"
import { previewShot } from "../model/previewshot"

const PREVIEW_DEBOUNCE = 0.15

export class DrillPanel {
  private readonly container: Container
  private readonly placeBallsBtn: HTMLButtonElement
  private readonly retryBtn: HTMLButtonElement
  private readonly replayBtn: HTMLButtonElement
  private readonly switchBallBtn: HTMLButtonElement
  private readonly previewBtn: HTMLButtonElement
  private centerPanel!: HTMLDivElement
  private previewActive = false
  private pendingPreview = false
  private ballsWerePlaced = false
  private wasPlacing = false
  private aimStableTime = 0
  private previewAimSnapshot: {
    angle: number
    power: number
    ox: number
    oy: number
    elevation: number
  } | null = null

  constructor(container: Container) {
    this.container = container

    this.placeBallsBtn = this.createBtn("Place Balls")
    this.placeBallsBtn.addEventListener("click", () => {
      if (this.container.table.allStationary()) {
        this.container.updateController(new PlaceAllBalls(this.container))
      }
    })

    this.retryBtn = this.createBtn("Retry")
    this.retryBtn.addEventListener("click", () => {
      const drill = this.container.rules as Drill
      const recorder = this.container.recorder
      const last = recorder.last()
      if (!drill.preShotState.length) return
      const prevAim = last >= 0 ? (recorder.entries[last].event as any) : null
      this.container.notification.clear()
      this.container.table.updateFromShortSerialised(drill.preShotState)
      if (prevAim?.i !== undefined) {
        drill.cueball = this.container.table.balls[prevAim.i]
      }
      this.container.updateController(new Aim(this.container))
      if (prevAim) {
        const aim = this.container.table.cue.aim
        if (prevAim.angle !== undefined) aim.angle = prevAim.angle
        if (prevAim.power !== undefined) aim.power = prevAim.power
        if (prevAim.offset) aim.offset.set(prevAim.offset.x ?? 0, prevAim.offset.y ?? 0, 0)
        if (prevAim.elevation !== undefined) aim.elevation = prevAim.elevation
        this.container.table.cue.updateAimInput()
      }
    })

    this.replayBtn = this.createBtn("Replay")
    this.replayBtn.addEventListener("click", () => {
      const drill = this.container.rules as Drill
      const recorder = this.container.recorder
      const last = recorder.last()
      if (!drill.preShotState.length || last < 0) return
      this.container.notification.clear()
      this.container.updateController(
        new DrillReplay(this.container, drill.preShotState, [
          recorder.entries[last].event,
        ])
      )
    })

    this.switchBallBtn = this.createBtn("Switch Ball")
    this.switchBallBtn.addEventListener("click", () => {
      const drill = this.container.rules as Drill
      const balls = this.container.table.balls
      drill.cueball = drill.cueball === balls[0] ? balls[1] : balls[0]
      const table = this.container.table
      table.cueball = drill.cueball
      table.cue.aim.i = balls.indexOf(drill.cueball)
      table.cue.moveTo(drill.cueball.pos)
      table.cue.aimAtNext(drill.cueball, drill.nextCandidateBall())
      table.cue.updateAimInput()
    })

    this.previewBtn = this.createBtn("Preview")
    this.previewBtn.addEventListener("click", () => {
      if (this.previewActive) {
        this.hidePreview()
      } else if (previewShot(this.container.table)) {
        const aim = this.container.table.cue.aim
        this.previewAimSnapshot = {
          angle: aim.angle,
          power: aim.power,
          ox: aim.offset.x,
          oy: aim.offset.y,
          elevation: aim.elevation,
        }
        this.previewActive = true
        this.pendingPreview = false
        this.aimStableTime = 0
        this.previewBtn.textContent = "Hide Preview"
      }
    })

    const topPanel = document.createElement("div")
    topPanel.className = "drill-panel drill-panel-top"
    topPanel.appendChild(this.replayBtn)

    const centerPanel = document.createElement("div")
    centerPanel.className = "drill-panel"
    this.centerPanel = centerPanel
    centerPanel.appendChild(this.placeBallsBtn)
    centerPanel.appendChild(this.retryBtn)
    centerPanel.appendChild(this.switchBallBtn)
    const gap = document.createElement("div")
    gap.className = "drill-gap"
    centerPanel.appendChild(gap)
    centerPanel.appendChild(this.previewBtn)

    const root = document.getElementById("viewP1")
    root?.appendChild(topPanel)
    root?.appendChild(centerPanel)

    const prevFrame = container.frame
    container.frame = (t: number) => {
      prevFrame?.(t)
      this.update(t)
    }
  }

  private createBtn(label: string): HTMLButtonElement {
    const btn = document.createElement("button") as HTMLButtonElement
    btn.className = "drill-btn"
    btn.textContent = label
    return btn
  }

  private hidePreview() {
    this.container.table.showTraces(false)
    this.container.table.proximityIndicator.hide()
    this.previewActive = false
    this.pendingPreview = false
    this.aimStableTime = 0
    this.previewAimSnapshot = null
    this.previewBtn.textContent = "Preview"
  }

  private runPendingPreview() {
    this.pendingPreview = false
    this.aimStableTime = 0
    if (previewShot(this.container.table)) {
      const aim = this.container.table.cue.aim
      this.previewAimSnapshot = {
        angle: aim.angle,
        power: aim.power,
        ox: aim.offset.x,
        oy: aim.offset.y,
        elevation: aim.elevation,
      }
    }
  }

  private update(t: number) {
    // When the elevation panel is open the Hit button shifts up; lift the drill
    // buttons so their bottom edge sits just above the Hit button's top. The Hit
    // button's raised position depends on --ball-size-base (smaller on mobile),
    // so measure it at runtime instead of hard-coding an offset.
    const tilt = document.getElementById("tiltSliderContainer")
    const elevationOpen = !!tilt && !(tilt as HTMLElement & { hidden: boolean }).hidden
    this.centerPanel.classList.toggle("elevation-open", elevationOpen)
    const hit = document.getElementById("cueHit")
    const offsetParent = this.centerPanel.offsetParent as HTMLElement | null
    if (elevationOpen && hit && offsetParent) {
      const hitRect = hit.getBoundingClientRect()
      const parentRect = offsetParent.getBoundingClientRect()
      const bottom = parentRect.bottom - hitRect.top + 12
      this.centerPanel.style.bottom = `${Math.max(bottom, 0)}px`
    } else {
      this.centerPanel.style.bottom = ""
    }

    const stationary = this.container.table.allStationary()
    const ctrl = this.container.controller
    const isAiming = ctrl instanceof Aim
    const isPlacing = ctrl instanceof PlaceAllBalls
    const isReplaying = ctrl instanceof DrillReplay
    const drill = this.container.rules as Drill
    const hasPreShot = drill.preShotState.length > 0
    const hasLastShot = this.container.recorder.last() >= 0

    if (this.wasPlacing && !isPlacing) {
      this.ballsWerePlaced = true
    }
    this.wasPlacing = isPlacing

    this.placeBallsBtn.disabled =
      !stationary || isPlacing || isReplaying || this.previewActive
    this.retryBtn.disabled = !isAiming || !hasPreShot
    this.replayBtn.disabled = !isAiming || !hasLastShot
    this.switchBallBtn.disabled = !isAiming || (!hasPreShot && !this.ballsWerePlaced)
    this.previewBtn.disabled = !isAiming

    if (this.previewActive) {
      if (!isAiming) {
        this.hidePreview()
        return
      }

      const a = this.container.table.cue.aim
      const s = this.previewAimSnapshot!
      const aimChanged =
        a.angle !== s.angle ||
        a.power !== s.power ||
        a.offset.x !== s.ox ||
        a.offset.y !== s.oy ||
        a.elevation !== s.elevation

      if (aimChanged) {
        this.container.table.showTraces(false)
        this.container.table.proximityIndicator.hide()
        this.previewAimSnapshot = {
          angle: a.angle,
          power: a.power,
          ox: a.offset.x,
          oy: a.offset.y,
          elevation: a.elevation,
        }
        this.pendingPreview = true
        this.aimStableTime = 0
      } else if (this.pendingPreview) {
        this.aimStableTime += t
        if (this.aimStableTime >= PREVIEW_DEBOUNCE) {
          this.runPendingPreview()
        }
      }
    }
  }
}
