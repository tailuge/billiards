import { id, getInput } from "../utils/dom"
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
      setstronge_omega_ratio
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

  initialiseSlider(id, initialValue, setter) {
    const slider = this.getInputElement(id)
    if (!slider) {
      return
    }
    slider.step = "0.001"
    slider.min = `${initialValue * 0.1}`
    slider.max = `${Math.min(initialValue * 4, 2)}`
    slider.value = initialValue
    setter(initialValue)
    this.showValue(id, initialValue)
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
