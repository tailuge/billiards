import { Color, Vector3 } from "three"
import { Container } from "../container/container"
import { Input } from "../events/input"
import { Session } from "../network/client/session"
import { Overlap } from "../utils/overlap"
import { unitAtAngle } from "../utils/three-utils"
import { id } from "../utils/dom"
import { TimeoutButton } from "./timeoutbutton"

export class AimInputs {
  readonly ballContainerWrapperElement
  readonly ballContainerElement
  readonly cueBallElement
  readonly cueTipElement
  readonly powerSliderContainerElement
  readonly cuePowerElement
  /** Shared button for both "Hit" and "Place Ball" actions. */
  readonly cueHitElement
  readonly objectBallStyle: CSSStyleDeclaration | undefined
  readonly container: Container
  readonly overlap: Overlap

  ballWidth
  ballHeight
  tipRadius
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
    this.overlap = new Overlap(this.container.table.balls)
    if (this.cuePowerElement) {
      this.container.table.cue.aim.power =
        Number(this.cuePowerElement.value) * this.container.table.cue.maxPower
      this.updatePowerProgress()
    }
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
    this.cueHitElement?.addEventListener("click", this.hit)
    this.cuePowerElement?.addEventListener("input", this.powerChanged)
    if (!("ontouchstart" in globalThis)) {
      id("viewP1")?.addEventListener("dblclick", this.hit)
    }
    document.addEventListener("wheel", this.mousewheel)
  }

  setButtonText(text) {
    this.cueHitElement && (this.cueHitElement.innerText = text)
  }

  setDisabled(disabled: boolean) {
    this.controlsDisabled = disabled || Session.isSpectator()
    this.updateHitButton()
    this.updatePowerElement()
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
        -(e.offsetX - this.ballWidth / 2) / this.ballWidth,
        -(e.offsetY - this.ballHeight / 2) / this.ballHeight
      ),
      this.container.table
    )
    this.container.lastEventTime = performance.now()
  }

  updateVisualState(x: number, y: number) {
    const elt = this.cueTipElement?.style
    if (elt) {
      // Use percentages so the tip scales automatically with the ball
      elt.left = ((-x + 0.5) * 100).toString() + "%"
      elt.top = ((-y + 0.5) * 100).toString() + "%"
      elt.transform = "translate(-50%, -50%)"
    }
    this.showOverlap()
  }

  showOverlap() {
    if (this.objectBallStyle) {
      const table = this.container.table
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
      } else {
        this.objectBallStyle.visibility = "hidden"
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

  updatePowerSlider(power) {
    if (this.cuePowerElement) {
      this.cuePowerElement.value = power
      this.updatePowerProgress()
    }
  }

  hit = (_) => {
    if (this.controlsDisabled) {
      return
    }
    this.container.table.cue.setPower(Number(this.cuePowerElement?.value))
    this.container.inputQueue.push(new Input(0, "SpaceUp"))
  }

  /**
   * The "Hit" animation logic for the slider.
   * Resets the cue visually to 0 and eases it back to the target position.
   * Does NOT change the actual game power - visual only.
   */
  animateSliderHit() {
    if (this.sliderAnimId !== null) return // Prevent multiple concurrent animations

    const target = parseFloat(this.cuePowerElement.value)
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
