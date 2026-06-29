import { Vector3 } from "three"
import { Container } from "../container/container"
import { Aim } from "../controller/aim"
import { DrillReplay } from "../controller/drillreplay"
import { AimEvent } from "../events/aimevent"
import { Ball } from "../model/ball"
import { maxPower } from "../model/physics/constants"
import { previewShot } from "../model/previewshot"
import {
  BallPos,
  ShotParams,
  SimOutcome,
  buildAxisSpecs,
  outcomeSignature,
  paramRangeOf,
} from "../sensitivity"
import { AnalysisSeed } from "../seedlink"
import {
  AnalysisHandle,
  Pick,
  RunAnalysisOptions,
  runAnalysisInto,
} from "./analysisrender"

/**
 * In-game split-screen shot analysis view (?ruletype=threecushion&practice&analysis).
 *
 * Left: the live 3D table (#viewP1) showing the loaded shot's trajectory traces
 * (view-only — same preview mechanism as drill mode). Right: a results panel with
 * the spin scatter + 1-D tolerance bars (src/view/analysisrender.ts). Only the
 * camera toggle is interactive. Layout/visibility are driven by `body.analysis-mode`.
 */
/** Debounce before re-previewing after the aim stops changing (seconds). Mirrors
 * DrillPanel so the trajectory doesn't recompute on every intermediate value. */
const PREVIEW_DEBOUNCE = 0.15

type AimSnapshot = {
  angle: number
  power: number
  ox: number
  oy: number
  elevation: number
}

export class AnalysisPanel {
  private readonly container: Container
  private started = false
  private previewShown = false
  private pendingPreview = false
  private aimStableTime = 0
  private aimSnapshot: AimSnapshot | null = null
  private handle: AnalysisHandle | null = null
  private seedShot: ShotParams | null = null
  /** True from the moment a shot is fired until the table is restored — only
   * the Hit/Restore button (now "Restore") stays interactive while true. */
  private awaitingRestore = false
  /** True while the controller is away from Aim (the shot is playing out);
   * used to detect the moment it returns to Aim right after OUR shot. */
  private hitInFlight = false
  /** Ball positions / aim captured the instant Hit was pressed, so Restore can
   * put the table back exactly as it was — independent of Drill's own
   * preShotState/recorder bookkeeping, which DrillReplay (below) bypasses. */
  private pendingRestoreState: number[] | null = null
  private pendingRestoreAim: AimEvent | null = null

  constructor(container: Container) {
    this.container = container
    document.body.classList.add("analysis-mode")
    // Shot playback feels snappier at 1.5x in this view only — drill mode and
    // normal play never touch timeScale, so they keep their default of 1.
    this.container.timeScale = 1.5

    this.buildPanel()
    this.buildCameraButton()
    this.container.view.camera.forceMode(this.container.view.camera.topView)

    // Take over the Hit button / canvas-dblclick entirely: a normal "SpaceUp"
    // shot shows no trajectory (PlayShot never calls showTraces), so Hit fires
    // the shot the same way DrillPanel's "Replay" button does (DrillReplay,
    // which shows traces) instead of the live-play Aim->PlayShot path.
    const aimInputs = this.container.table.cue.aimInputs
    aimInputs.cueHitElement?.removeEventListener("click", aimInputs.hit)
    document
      .getElementById("viewP1")
      ?.removeEventListener("dblclick", aimInputs.hit)
    aimInputs.cueHitElement?.addEventListener("click", this.onHitOrRestore)
    document
      .getElementById("viewP1")
      ?.addEventListener("dblclick", this.onHitOrRestore)
    document.getElementById("analysisPanel")?.addEventListener(
      "click",
      (e) => {
        if (this.awaitingRestore) {
          e.preventDefault()
          e.stopPropagation()
          this.restore()
        }
      },
      { capture: true }
    )

    // Wait for the Aim controller to apply the URL's initShot and the balls to
    // settle before capturing the seed and kicking off the scan — then keep the
    // trajectory preview in sync as the player adjusts the shot parameters.
    const prevFrame = container.frame
    container.frame = (t: number) => {
      prevFrame?.(t)
      if (!this.started) {
        this.maybeStart()
      } else {
        this.trackHitLifecycle()
        this.updatePreview(t)
      }
    }
  }

  /** Detect the shot lifecycle: once the controller leaves `Aim` (a shot is
   * playing) and then returns to it (the rules auto-construct a fresh `Aim`,
   * which on its own would re-enable every control and reset the button to
   * "Hit" — see Aim.onFirst), immediately lock it back down into a
   * Restore-only state so the player can't queue a second real shot without
   * restoring first. */
  private trackHitLifecycle() {
    const isAiming = this.container.controller instanceof Aim
    if (!isAiming) {
      this.hitInFlight = true
    } else if (this.hitInFlight) {
      this.hitInFlight = false
      this.enterAwaitingRestore()
    }
  }

  private enterAwaitingRestore() {
    const aimInputs = this.container.table.cue.aimInputs
    aimInputs.setDisabled(true)
    if (aimInputs.cueHitElement) aimInputs.cueHitElement.disabled = false
    aimInputs.setButtonText("Restore")
    this.awaitingRestore = true
  }

  private onHitOrRestore = () => {
    if (this.awaitingRestore) {
      this.restore()
    } else {
      this.fireHit()
    }
  }

  /** Fire the live aim — like DrillPanel's "Replay" button, not the normal
   * live-play Hit (Aim -> "SpaceUp" -> PlayShot, which never shows traces):
   * DrillReplay's constructor turns trace lines on before playing, so the
   * trajectory stays visible through the shot and while awaiting Restore. */
  private fireHit() {
    const table = this.container.table
    const aimInputs = table.cue.aimInputs
    if (aimInputs.isDisabled()) return
    aimInputs.hideTiltControl()
    this.pendingRestoreState = table.shortSerialise()
    this.pendingRestoreAim = table.cue.aim.copy()
    this.container.updateController(
      new DrillReplay(this.container, this.pendingRestoreState, [
        table.cue.aim.copy(),
      ])
    )
  }

  /** Put the table back exactly how it was before the shot just played — the
   * positions/aim captured at the moment Hit was pressed (`fireHit`). */
  private restore() {
    if (!this.pendingRestoreState) return
    const table = this.container.table
    table.showTraces(false)
    table.updateFromShortSerialised(this.pendingRestoreState)
    this.container.updateController(new Aim(this.container))
    const prevAim = this.pendingRestoreAim
    if (prevAim) {
      const aim = table.cue.aim
      aim.angle = prevAim.angle
      aim.power = prevAim.power
      aim.offset.set(prevAim.offset.x, prevAim.offset.y, 0)
      aim.elevation = prevAim.elevation
      table.cue.updateAimInput()
    }
    this.previewShown = false
    this.aimSnapshot = null
    this.awaitingRestore = false
    this.refreshMarkers()
  }

  private maybeStart() {
    const ctrl = this.container.controller
    if (!(ctrl instanceof Aim)) return
    if (!this.container.table.allStationary()) return
    this.started = true
    this.start()
  }

  private start() {
    const seed = this.captureSeed()
    this.seedShot = seed.shot
    // Restrict the table-view's aim drag / tilt slider to the same fixed
    // (seed-centred) window the "aim shift" / "elevation" bars display and
    // already clamp picks to (see analysisrender.ts's nearestGridValue).
    const [angleAxis, elevAxis] = buildAxisSpecs(
      seed.shot,
      seed.balls,
      seed.cueBallId,
      ["angle", "elevation"]
    )
    const angleRange = paramRangeOf(angleAxis)
    const elevRange = paramRangeOf(elevAxis)
    this.container.table.cue.aimLimits = {
      angleMin: angleRange.scannedMin,
      angleMax: angleRange.scannedMax,
      elevationMin: elevRange.scannedMin,
      elevationMax: elevRange.scannedMax,
    }
    // Draw the trajectory on the table and capture the authoritative
    // (main-thread) outcome so the worker's reproduction can be checked.
    const outcomes = previewShot(this.container.table, this.container.step)
    this.previewShown = !!outcomes
    this.aimSnapshot = this.snapshotAim()

    const opts: RunAnalysisOptions = {
      onPick: (pick) => this.onPick(pick),
      onShowElevation: () =>
        this.container.table.cue.aimInputs.showTiltControl(),
    }
    if (outcomes) {
      opts.expectedSignature = outcomeSignature(
        this.toSimOutcomes(outcomes),
        seed.cueBallId
      )
    }
    const host = document.getElementById("analysisContent")!
    this.handle = runAnalysisInto(host, seed, opts)
    this.refreshMarkers()
  }

  /** Apply a click-pick from a display to the live cue aim (which syncs the
   * table trajectory and the cue-ball / power / tilt widgets), then move the
   * markers. The per-frame preview loop re-draws the trajectory after this. */
  private onPick(pick: Pick) {
    const table = this.container.table
    const cue = table.cue
    switch (pick.kind) {
      case "spin":
        cue.setSpin(new Vector3(pick.x, pick.y, 0), table)
        break
      case "angle":
        cue.rotateAim(pick.value - cue.aim.angle, table)
        break
      case "power":
        cue.setPower(pick.value / maxPower)
        break
      case "elevation":
        cue.setElevation(pick.value)
        break
    }
    this.refreshMarkers()
  }

  /** Push the current live shot to the analysis displays — moving the single
   * white marker on the scatter and bars to the current parameters. */
  private refreshMarkers() {
    if (this.handle && this.seedShot) {
      this.handle.setLiveShot(this.currentShot(), this.seedShot)
    }
  }

  private currentShot(): ShotParams {
    const a = this.container.table.cue.aim
    return {
      angle: a.angle,
      power: a.power,
      offsetX: a.offset.x,
      offsetY: a.offset.y,
      elevation: a.elevation,
    }
  }

  /** Re-run the trajectory preview when the shot parameters change, debounced —
   * the same live-preview behaviour as drill mode (the analysis scan itself is
   * left fixed to the originally-loaded seed). */
  private updatePreview(t: number) {
    if (!(this.container.controller instanceof Aim)) {
      // The shot is playing (fireHit's DrillReplay already turned traces on
      // and they should stay visible through it and into awaitingRestore) —
      // just stop tracking the stale pre-hit preview; re-preview once aiming
      // again (restore() turns traces back off before that happens).
      if (this.previewShown) {
        this.previewShown = false
        this.aimSnapshot = null
      }
      return
    }

    if (!this.aimSnapshot) {
      this.runPreview()
      return
    }

    const a = this.container.table.cue.aim
    const s = this.aimSnapshot
    const changed =
      a.angle !== s.angle ||
      a.power !== s.power ||
      a.offset.x !== s.ox ||
      a.offset.y !== s.oy ||
      a.elevation !== s.elevation

    if (changed) {
      this.container.table.showTraces(false)
      this.container.table.proximityIndicator.hide()
      this.aimSnapshot = this.snapshotAim()
      this.pendingPreview = true
      this.aimStableTime = 0
      // The marker follows the shot immediately (only the trajectory is
      // debounced), so changing the aim from the table side moves it live.
      this.refreshMarkers()
    } else if (this.pendingPreview) {
      this.aimStableTime += t
      if (this.aimStableTime >= PREVIEW_DEBOUNCE) {
        this.runPreview()
      }
    }
  }

  private runPreview() {
    this.pendingPreview = false
    this.aimStableTime = 0
    this.previewShown = !!previewShot(this.container.table, this.container.step)
    this.aimSnapshot = this.snapshotAim()
  }

  private snapshotAim(): AimSnapshot {
    const a = this.container.table.cue.aim
    return {
      angle: a.angle,
      power: a.power,
      ox: a.offset.x,
      oy: a.offset.y,
      elevation: a.elevation,
    }
  }

  /** Capture the loaded shot straight from the live table. Ball ids are array
   * indices so they line up with the worker (which rebuilds balls in array
   * order) and with `cueBallId` used as an index by aim.ts / the engine. */
  private captureSeed(): AnalysisSeed {
    const table = this.container.table
    const balls: BallPos[] = table.balls.map((b, i) => ({
      id: i,
      pos: { x: b.pos.x, y: b.pos.y, z: 0 },
    }))
    const aim = table.cue.aim
    const cueBallId = Math.max(0, table.balls.indexOf(table.cueball))
    const shot: ShotParams = {
      angle: aim.angle,
      power: aim.power,
      offsetX: aim.offset.x,
      offsetY: aim.offset.y,
      elevation: aim.elevation,
    }
    const cushionModel =
      new URLSearchParams(location.search).get("cushionModel") ?? "mathavan"
    return { balls, cueBallId, shot, ruleType: "threecushion", cushionModel }
  }

  /** Main-thread Outcome[] → worker-shaped SimOutcome[], with balls keyed by
   * their array index (matching captureSeed / the worker's id scheme). */
  private toSimOutcomes(
    outcomes: { type: string; ballA: Ball | null; ballB: Ball | null }[]
  ): SimOutcome[] {
    const balls = this.container.table.balls
    return outcomes.map((o) => {
      const sim: SimOutcome = { type: o.type }
      if (o.ballA) sim.ballA = balls.indexOf(o.ballA)
      if (o.ballB) sim.ballB = balls.indexOf(o.ballB)
      return sim
    })
  }

  private buildPanel() {
    const panel = document.createElement("div")
    panel.id = "analysisPanel"
    panel.innerHTML =
      `<div class="analysis-header">` +
      `<span class="analysis-title">Shot analysis</span>` +
      `</div>` +
      `<div id="analysisContent" class="analysis-content"></div>`
    document.body.appendChild(panel)
  }

  private buildCameraButton() {
    const btn = document.createElement("button")
    btn.id = "analysisCamera"
    btn.className = "analysis-camera-btn"
    btn.title = "change camera angle"
    btn.setAttribute("aria-label", "Change camera angle")
    btn.textContent = "🎥"
    btn.addEventListener("click", () => {
      this.container.view.camera.toggleMode()
    })
    document.getElementById("viewP1")?.appendChild(btn)
  }
}
