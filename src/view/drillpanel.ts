import { Container } from "../container/container"
import { Aim } from "../controller/aim"
import { PlaceAllBalls } from "../controller/placeallballs"
import { DrillReplay } from "../controller/drillreplay"
import { Drill } from "../controller/rules/drill"
import { previewShot } from "../model/previewshot"
import { BallPos, ShotParams } from "../sensitivity"
import { AnalysisSeed, buildAnalysisUrl } from "../seedlink"

const PREVIEW_DEBOUNCE = 0.15

export class DrillPanel {
  private readonly container: Container
  private readonly placeBallsBtn: HTMLButtonElement
  private readonly retryBtn: HTMLButtonElement
  private readonly replayBtn: HTMLButtonElement
  private readonly switchBallBtn: HTMLButtonElement
  private readonly previewBtn: HTMLButtonElement
  private readonly analyseBtn: HTMLButtonElement
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
        if (prevAim.offset)
          aim.offset.set(prevAim.offset.x ?? 0, prevAim.offset.y ?? 0, 0)
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
      } else if (previewShot(this.container.table, this.container.step)) {
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

    this.analyseBtn = this.createBtn("Shot Analysis")
    this.analyseBtn.addEventListener("click", () => {
      const seed = this.captureSeed()
      if (!seed) return
      const overlay = document.getElementById("analysisOverlay")
      const iframe = overlay?.querySelector("iframe")
      if (overlay && iframe) {
        // Blank the iframe before showing the overlay so the previous
        // analysis isn't flashed while the new page loads, then navigate on
        // the next frame so the src change is a real reload even when the
        // shot is unchanged (same URL as last time would otherwise no-op).
        iframe.src = "about:blank"
        overlay.removeAttribute("hidden")
        requestAnimationFrame(() => {
          iframe.src = buildAnalysisUrl(seed)
        })
      }
    })

    document.getElementById("analysisClose")?.addEventListener("click", () => {
      const overlay = document.getElementById("analysisOverlay")
      const iframe = overlay?.querySelector("iframe")
      if (iframe) iframe.src = "about:blank"
      overlay?.setAttribute("hidden", "true")
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

    const rightPanel = document.createElement("div")
    rightPanel.className = "drill-panel drill-panel-right"
    rightPanel.appendChild(this.analyseBtn)

    const root = document.getElementById("viewP1")
    root?.appendChild(topPanel)
    root?.appendChild(centerPanel)
    root?.appendChild(rightPanel)

    const prevFrame = container.frame
    container.frame = (t: number) => {
      prevFrame?.(t)
      this.update(t)
    }
  }

  /** Reconstruct the pre-shot seed (positions + aim + model) of the last shot,
   * shaped for the standalone analysis page handoff (src/seedlink.ts). */
  private captureSeed(): AnalysisSeed | null {
    const drill = this.container.rules as Drill
    const recorder = this.container.recorder
    const last = recorder.last()
    if (last < 0 || !drill.preShotState.length) {
      console.warn("[shot-analysis] no recorded shot yet — play a shot first")
      return null
    }
    // preShotState is shortSerialise(): flat [x,y] per ball in table order.
    const state = drill.preShotState
    const balls: BallPos[] = this.container.table.balls.map((b, i) => ({
      id: b.id,
      pos: { x: state[i * 2], y: state[i * 2 + 1], z: 0 },
    }))
    const ev = recorder.entries[last].event as any
    const cueBallId = this.container.table.balls[ev.i ?? 0].id
    const shot: ShotParams = {
      angle: ev.angle,
      power: ev.power,
      offsetX: ev.offset?.x ?? 0,
      offsetY: ev.offset?.y ?? 0,
      elevation: ev.elevation ?? 0,
    }
    const cushionModel =
      new URLSearchParams(location.search).get("cushionModel") ?? "mathavan"
    return { balls, cueBallId, shot, ruleType: "threecushion", cushionModel }
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
    if (previewShot(this.container.table, this.container.step)) {
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
    const elevationOpen =
      !!tilt && !(tilt as HTMLElement & { hidden: boolean }).hidden
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
    this.switchBallBtn.disabled =
      !isAiming || (!hasPreShot && !this.ballsWerePlaced)
    this.previewBtn.disabled = !isAiming
    // Only meaningful right after a shot that actually scored: in drill mode a
    // scoring shot increments the break, a miss resets it to 0. Also disabled
    // while the analysis overlay is open so re-clicking can't re-run the scan.
    const analysisOpen = !document
      .getElementById("analysisOverlay")
      ?.hasAttribute("hidden")
    this.analyseBtn.disabled =
      analysisOpen || !isAiming || !hasLastShot || drill.currentBreak <= 0

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
