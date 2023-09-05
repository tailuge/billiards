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
  constructor() {
    this.initialiseSider("R", R, setR)
    this.initialiseSider("m", m, setm)
    this.initialiseSider("e", e, sete)
    this.initialiseSider("mu", mu, setmu)
    this.initialiseSider("muS", muS, setmuS)
    this.initialiseSider("muC", muC, setmuC)
    this.initialiseSider("rho", rho, setrho)
  }

  getInputElement(id) {
    return document.getElementById(id) as HTMLInputElement
  }

  initialiseSider(element, initialValue, setter) {
    const slider = this.getInputElement(element)
    if (!slider) {
      return
    }
    slider.step = "0.001"
    slider.min = "0.01"
    slider.max = "1.0"
    slider.value = initialValue
    this.showValue(element, initialValue)
    slider.oninput = (e) => {
      const val = parseFloat((e.target as HTMLInputElement).value)
      this.showValue(element, val)
      setter(val)
    }
  }

  showValue(element, value) {
    document.querySelector(
      `label[for=${element}]`
    )!.innerHTML = `${element}=${value}`
  }
}
