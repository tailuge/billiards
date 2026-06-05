import { Color, Vector3 } from "three"
import { Container } from "../../container/container"
import { Input } from "../../events/input"
import { Session } from "../../network/client/session"
import { Overlap } from "../../utils/overlap"
import { unitAtAngle } from "../../utils/three-utils"
import { id } from "../../utils/dom"
import { TimeoutButton } from "../timeoutbutton"
import { AngleInput } from "./angleinput"
import { maxPower } from "../../model/physics/constants"

export class AimInputs {
  readonly ballContainerWrapperElement
  readonly ballContainerElement
  readonly cueBallElement
  readonly cueTipElement
  readonly powerSliderContainerElement
  readonly cuePowerElement
  readonly tiltSliderContainerElement
  readonly openElevationElement
  readonly cueTiltElement: AngleInput
  /** Shared button for both "Hit" and "Place Ball" actions. */
  readonly cueHitElement
  readonly objectBallStyle: CSSStyleDeclaration | undefined
  readonly objectBallOverlap: HTMLElement | null
  readonly container: Container
  readonly overlap: Overlap

  ballWidth
  ballHeight
  tipRadius
  private static readonly TIP_SCALE = 1.3
  private controlsDisabled = true
  private readonly timeoutButton: TimeoutButton | undefined
  private sliderAnimId: number | null = null

  constructor(container) {
    this.container = container
    this.ballContainerWrapperElement = id("ballContainerWrapper")
    this.ballContainerElement = id("ballContainer")
    this.cueBallElement = id("cueBall")
    this.cueTipElement = id("cueTip")
    this.powerSliderContainerElement = id("powerSliderContainer")
    this.cuePowerElement = id("cuePower")
    this.tiltSliderContainerElement = id("tiltSliderContainer")
    this.openElevationElement = id("openElevation") as HTMLButtonElement
    this.cueTiltElement = id("cueTilt") as AngleInput
    this.cueHitElement = id("cueHit") as HTMLButtonElement
    if (this.cueHitElement) {
      const params = new URLSearchParams(location.search)
      const shotClockSeconds = params.get("shotClock")
      const duration = shotClockSeconds
        ? Number(shotClockSeconds) * 1000
        : 20000
      this.timeoutButton = new TimeoutButton(this.cueHitElement, {
        duration,
        onComplete: () => {
          this.cueHitElement?.click()
        },
      })
    }
    this.objectBallStyle = id("objectBall")?.style
    this.objectBallOverlap = id("objectBallOverlap")
    this.overlap = new Overlap(this.container.table.balls)
    if (this.cuePowerElement) {
      this.container.table.cue.aim.power =
        Number(this.cuePowerElement.value) * maxPower
      this.updatePowerProgress()
    }
    this.updateTiltSlider(this.container.table.cue.aim.elevation)
    this.addListeners()
    this.updateVisualState(0, 0)
    if (Session.isSpectator()) {
      this.setDisabled(true)
    }
  }

  addListeners() {
    this.cueBallElement?.addEventListener("pointermove", this.mousemove)
    this.cueBallElement?.addEventListener("click", (e) => {
      this.adjustSpin(e)
    })
    this.cueBallElement?.addEventListener("dblclick", this.toggleTiltControl)
    this.openElevationElement?.addEventListener("click", this.toggleTiltControl)
    this.cueHitElement?.addEventListener("click", this.hit)
    this.cuePowerElement?.addEventListener("input", this.powerChanged)
    this.cueTiltElement?.addEventListener("input", this.tiltChanged)
    if (!("ontouchstart" in globalThis)) {
      id("viewP1")?.addEventListener("dblclick", this.hit)
    }
    document.addEventListener("wheel", this.mousewheel, { passive: false })
  }

  setButtonText(text) {
    this.cueHitElement && (this.cueHitElement.innerText = text)
  }

  setDisabled(disabled: boolean) {
    this.controlsDisabled = disabled || Session.isSpectator()
    this.updateHitButton()
    this.updatePowerElement()
    this.updateTiltElement()
    this.updateCueBall()
    this.updateBallContainer()
    if (this.objectBallStyle) {
      if (this.controlsDisabled) {
        this.objectBallStyle.visibility = "hidden"
      } else {
        this.showOverlap()
      }
    }
  }

  private updateBallContainer() {
    if (this.ballContainerWrapperElement) {
      this.ballContainerWrapperElement.classList.toggle(
        "is-disabled",
        this.controlsDisabled
      )
    }
    if (this.ballContainerElement) {
      this.ballContainerElement.classList.toggle(
        "is-disabled",
        this.controlsDisabled
      )
    }
  }

  private updateHitButton() {
    if (this.cueHitElement) {
      this.cueHitElement.disabled = this.controlsDisabled
      if (this.controlsDisabled) {
        this.timeoutButton?.cancel()
      } else {
        const useShotClock =
          !this.container.isSinglePlayer || Session.isBotMode()
        if (useShotClock) {
          this.timeoutButton?.startTimer()
        }
      }
    }
  }

  private updatePowerElement() {
    if (this.powerSliderContainerElement) {
      this.powerSliderContainerElement.classList.toggle(
        "is-disabled",
        this.controlsDisabled
      )
    }
    if (this.cuePowerElement) {
      this.cuePowerElement.disabled = this.controlsDisabled
      this.cuePowerElement.classList.toggle(
        "is-disabled",
        this.controlsDisabled
      )
    }
  }

  private updateTiltElement() {
    if (this.tiltSliderContainerElement) {
      this.tiltSliderContainerElement.classList.toggle(
        "is-disabled",
        this.controlsDisabled
      )
      if (this.controlsDisabled) {
        this.tiltSliderContainerElement.hidden = true
      }
    }
    if (this.cueTiltElement) {
      this.cueTiltElement.disabled = this.controlsDisabled
    }
    if (this.openElevationElement) {
      this.openElevationElement.disabled = this.controlsDisabled
    }
  }

  private updateCueBall() {
    if (this.cueBallElement) {
      this.cueBallElement.style.pointerEvents = this.controlsDisabled
        ? "none"
        : "auto"
      this.cueBallElement.classList.toggle("is-disabled", this.controlsDisabled)
    }
  }

  isDisabled(): boolean {
    return this.controlsDisabled
  }

  mousemove = (e) => {
    e.buttons === 1 && this.adjustSpin(e)
  }

  readDimensions() {
    this.ballWidth = this.cueBallElement?.offsetWidth
    this.ballHeight = this.cueBallElement?.offsetHeight
    this.tipRadius = this.cueTipElement?.offsetWidth / 2
  }

  adjustSpin(e) {
    if (this.controlsDisabled) {
      return
    }
    this.readDimensions()
    this.container.table.cue.setSpin(
      new Vector3(
        -(e.offsetX - this.ballWidth / 2) /
          (this.ballWidth / 2) /
          AimInputs.TIP_SCALE,
        -(e.offsetY - this.ballHeight / 2) /
          (this.ballHeight / 2) /
          AimInputs.TIP_SCALE
      ),
      this.container.table
    )
    this.container.lastEventTime = performance.now()
  }

  updateVisualState(x: number, y: number) {
    const elt = this.cueTipElement?.style
    if (elt) {
      // Use percentages so the tip scales automatically with the ball
      elt.left = ((-(x * AimInputs.TIP_SCALE) / 2 + 0.5) * 100).toString() + "%"
      elt.top = ((-(y * AimInputs.TIP_SCALE) / 2 + 0.5) * 100).toString() + "%"
      elt.transform = "translate(-50%, -50%)"
    }
    this.showOverlap()
  }

  showOverlap() {
    if (this.objectBallStyle) {
      const table = this.container.table
      if (table.cue) {
        const dir = unitAtAngle(table.cue.aim.angle)
        const closest = this.overlap.getOverlapOffset(table.cueball, dir)
        if (closest) {
          this.readDimensions()
          this.objectBallStyle.visibility = "visible"
          this.objectBallStyle.left =
            (closest.overlap * this.ballWidth) / 2 +
            this.cueBallElement.offsetLeft +
            "px"
          this.objectBallStyle.backgroundColor = new Color(0, 0, 0)
            .lerp(closest.ball.ballmesh.color, 0.5)
            .getStyle()
          if (this.objectBallOverlap) {
            const overlapPercent = Math.round(
              (1 - Math.min(Math.abs(closest.overlap) / 2, 1)) * 100
            )
            this.objectBallOverlap.innerText = overlapPercent + "%"
          }
        } else {
          this.objectBallStyle.visibility = "hidden"
          if (this.objectBallOverlap) {
            this.objectBallOverlap.innerText = ""
          }
        }
      }
    }
  }

  private updatePowerProgress() {
    if (this.cuePowerElement) {
      const percent = Number(this.cuePowerElement.value) * 100
      this.cuePowerElement.style.setProperty("--p", percent + "%")
    }
  }

  powerChanged = (_) => {
    if (this.controlsDisabled) {
      return
    }
    this.container.table.cue.setPower(Number(this.cuePowerElement.value))
    this.updatePowerProgress()
  }

  tiltChanged = (_) => {
    if (this.controlsDisabled || !this.cueTiltElement) {
      return
    }
    this.container.table.cue.aim.elevation = this.cueTiltElement.elevation
    this.container.lastEventTime = performance.now()
  }

  updatePowerSlider(power) {
    if (this.cuePowerElement) {
      this.cuePowerElement.value = power
      this.updatePowerProgress()
    }
  }

  updateTiltSlider(elevation) {
    if (this.cueTiltElement) {
      this.cueTiltElement.elevation = elevation
      if (this.controlsDisabled) {
        if (elevation > 0) {
          this.showTiltControl()
        } else {
          this.hideTiltControl()
        }
      }
    }
  }

  private showTiltControl() {
    if (!this.tiltSliderContainerElement) {
      return
    }
    this.tiltSliderContainerElement.hidden = false
    requestAnimationFrame(() => {
      this.tiltSliderContainerElement?.classList.add("is-open")
    })
  }

  toggleTiltControl = (e?: any) => {
    if (this.controlsDisabled || !this.tiltSliderContainerElement) {
      return
    }
    e?.preventDefault?.()
    e?.stopPropagation?.()
    if (this.tiltSliderContainerElement.hidden) {
      this.showTiltControl()
    } else {
      this.hideTiltControl()
    }
  }

  hideTiltControl() {
    if (this.tiltSliderContainerElement) {
      this.tiltSliderContainerElement.classList.remove("is-open")
      this.tiltSliderContainerElement.hidden = true
    }
  }

  hit = (_) => {
    if (this.controlsDisabled) {
      return
    }
    this.container.table.cue.setPower(Number(this.cuePowerElement?.value))
    this.hideTiltControl()
    this.container.inputQueue.push(new Input(0, "SpaceUp"))
  }

  /**
   * The "Hit" animation logic for the slider.
   * Resets the cue visually to 0 and eases it back to the target position.
   * Does NOT change the actual game power - visual only.
   */
  animateSliderHit() {
    if (this.sliderAnimId !== null) return // Prevent multiple concurrent animations

    const target = Number.parseFloat(this.cuePowerElement.value)
    const duration = 2000 // Increased to 2s to allow for the 1s delay
    let start: number | null = null

    this.setSliderVisual(0) // Start the visual stroke from 0

    const animate = (now: number) => {
      if (!start) start = now
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)

      let ease: number
      if (progress < 0.5) {
        // First 50% (1 second): Stay very close to 0
        ease = Math.pow(progress * 2, 8) * 0.05
      } else {
        // Second 50% (1 second): Rapidly stroke to target
        const p2 = (progress - 0.5) * 2
        // OutQuart-like finish: starts fast from the 1s mark
        ease = 0.05 + 0.95 * (1 - Math.pow(1 - p2, 4))
      }

      this.setSliderVisual(ease * target)

      if (progress < 1) {
        this.sliderAnimId = requestAnimationFrame(animate)
      } else {
        this.sliderAnimId = null
      }
    }

    // Short delay ensures the initial '0' value renders before animation starts
    setTimeout(() => {
      this.sliderAnimId = requestAnimationFrame(animate)
    }, 50)
  }

  /**
   * Sets the slider visual without changing the actual game power.
   * Updates both the CSS variable and the input value for visual consistency.
   */
  private setSliderVisual(val: number) {
    const percent = val * 100
    this.cuePowerElement.value = val.toString()
    this.cuePowerElement.style.setProperty("--p", percent + "%")
  }

  mousewheel = (e) => {
    if (e.ctrlKey) {
      e.preventDefault()
      return
    }
    if (this.controlsDisabled) {
      return
    }
    if (this.cuePowerElement) {
      this.cuePowerElement.value = (
        Number(this.cuePowerElement.value) -
        Math.sign(e.deltaY) / 10
      ).toString()
      this.container.table.cue.setPower(Number(this.cuePowerElement.value))
      this.updatePowerProgress()
      this.container.lastEventTime = performance.now()
    }
  }
}
