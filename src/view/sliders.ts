import {
  R,
  e,
  m,
  mu,
  muC,
  muS,
  rho,
  setR,
  sete,
  setm,
  setmu,
  setmuC,
  setmuS,
  setrho,
} from "../model/physics/constants"

export class Sliders {
  style
  notify

  constructor(notify?) {
    this.notify = notify ?? (() => {})
    this.style =
      (document.getElementById("constants") as HTMLElement)?.style ?? {}

    this.initialiseSlider("R", R, setR)
    this.initialiseSlider("m", m, setm)
    this.initialiseSlider("e", e, sete)
    this.initialiseSlider("mu", mu, setmu)
    this.initialiseSlider("muS", muS, setmuS)
    this.initialiseSlider("muC", muC, setmuC)
    this.initialiseSlider("rho", rho, setrho)
  }

  toggleVisibility() {
    this.style.visibility =
      this.style.visibility === "visible" ? "hidden" : "visible"
  }

  getInputElement(id) {
    return (document.getElementById(id) as HTMLInputElement) ?? {}
  }

  initialiseSlider(id, initialValue, setter, max = 1) {
    const slider = this.getInputElement(id)
    slider.step = "0.001"
    slider.min = "0.01"
    slider.max = `${max}`
    slider.value = initialValue
    this.showValue(id, initialValue)
    slider.oninput = (e) => {
      const val = parseFloat((e.target as HTMLInputElement).value)
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
