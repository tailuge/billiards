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
  }

  toggleVisibility() {
    this.style.visibility =
      this.style.visibility === "visible" ? "hidden" : "visible"
  }

  getInputElement(id) {
    return getInput(id)
  }

  initialiseSlider(id, initialValue, setter, max = 1) {
    const slider = this.getInputElement(id)
    if (!slider) {
      return
    }
    slider.step = "0.001"
    slider.min = "0.01"
    slider.max = `${max}`
    slider.value = initialValue
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
