import { id, getInput } from "../utils/dom"
import { omega_ratio_bounds } from "../model/physics/stronge"
import {
  R,
  e,
  m,
  mu,
  muC,
  muS,
  rho,
  μs,
  μw,
  ee,
  stronge_omega_ratio,
  stronge_e_n,
  stronge_μ,
  setR,
  sete,
  setm,
  setmu,
  setmuC,
  setmuS,
  setrho,
  setμs,
  setμw,
  setee,
  setstronge_omega_ratio,
  setstronge_e_n,
  setstronge_μ,
} from "../model/physics/constants"

/**
 * The span a slider is allowed to move over, when the default
 * `min(step, 4 x seeded, 2)` rule is not wide enough or is in fact invalid for
 * the constant behind it.
 *
 * The bounds are inclusive as far as the DOM is concerned, so a caller with a
 * genuinely exclusive domain has to inset it itself; `stronge_omega_ratio` is
 * the case in point, and the solver throws on values outside its open interval.
 */
type SliderDomain = { min: number; max: number }

/** Range input granularity, shared by every constant slider. */
const step = 0.0001

/**
 * Inclusive slider domain for `stronge_omega_ratio`, inset by one step from the
 * open interval `resolve` enforces, so that no reachable position of the slider
 * -- including either end stop -- can be handed to the solver as an invalid
 * value and throw at the next cushion contact.
 */
const omega_ratio_domain: SliderDomain = {
  min: omega_ratio_bounds.min + step,
  max: omega_ratio_bounds.max - step,
}

export class Sliders {
  style
  notify

  constructor(notify?) {
    this.notify = notify ?? (() => {})
    this.style = id("constants")?.style ?? {}

    const urlParams = new URLSearchParams(window.location.search)

    const get = (key, fallback) => {
      const val = Number.parseFloat(urlParams.get(key)!)
      return Number.isNaN(val) ? fallback : val
    }

    this.initialiseSlider("R", get("R", R), setR)
    this.initialiseSlider("m", get("m", m), setm)
    this.initialiseSlider("e", get("e", e), sete)
    this.initialiseSlider("mu", get("mu", mu), setmu)
    this.initialiseSlider("muS", get("muS", muS), setmuS)
    this.initialiseSlider("muC", get("muC", muC), setmuC)
    this.initialiseSlider("rho", get("rho", rho), setrho)
    this.initialiseSlider("μs", get("μs", μs), setμs)
    this.initialiseSlider("μw", get("μw", μw), setμw)
    this.initialiseSlider("ee", get("ee", ee), setee)
    this.initialiseSlider(
      "stronge_omega_ratio",
      get("stronge_omega_ratio", stronge_omega_ratio),
      setstronge_omega_ratio,
      omega_ratio_domain
    )
    this.initialiseSlider(
      "stronge_e_n",
      get("stronge_e_n", stronge_e_n),
      setstronge_e_n
    )
    this.initialiseSlider(
      "stronge_μ",
      get("stronge_μ", stronge_μ),
      setstronge_μ
    )
  }

  toggleVisibility() {
    this.style.visibility =
      this.style.visibility === "visible" ? "hidden" : "visible"
  }

  getInputElement(id) {
    return getInput(id)
  }

  initialiseSlider(id, initialValue, setter, domain?: SliderDomain) {
    const slider = this.getInputElement(id)
    if (!slider) {
      return
    }
    slider.step = `${step}`
    slider.min = `${domain?.min ?? step}`
    slider.max = `${domain?.max ?? Math.min(initialValue * 4, 2)}`
    slider.value = initialValue
    // A launch parameter or a hand-edited URL can name a value outside the
    // domain, and assigning to `value` does not change the number we were
    // handed. Reading it back lets the browser clamp it, so the constant and
    // the label agree with what the control is actually showing instead of
    // pushing a value the model will reject into the physics.
    const seeded = Number.parseFloat(slider.value)
    setter(seeded)
    this.showValue(id, seeded)
    slider.oninput = (e) => {
      const val = Number.parseFloat((e.target as HTMLInputElement).value)
      setter(val)
      this.showValue(id, val)
      this.notify()
    }
  }

  showValue(element, value) {
    const label = document.querySelector(`label[for=${element}]`)
    label && (label.innerHTML = `${element}=${value}`)
  }
}
