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
    this.notify = notify
    this.style =
      (document.getElementById("constants") as HTMLElement)?.style ?? {}

    this.initialiseSider("R", R, setR)
    this.initialiseSider("m", m, setm)
    this.initialiseSider("e", e, sete)
    this.initialiseSider("mu", mu, setmu)
    this.initialiseSider("muS", muS, setmuS)
    this.initialiseSider("muC", muC, setmuC)
    this.initialiseSider("rho", rho, setrho)
  }

  toggleVisibility() {
    this.style.visibility =
      this.style.visibility === "visible" ? "hidden" : "visible"
  }

  getInputElement(id) {
    return (document.getElementById(id) as HTMLInputElement) ?? {}
  }

  initialiseSider(id, initialValue, setter) {
    const slider = this.getInputElement(id)
    slider.step = "0.001"
    slider.min = "0.01"
    slider.max = "1.0"
    slider.value = initialValue
    this.showValue(id, initialValue)
    slider.oninput = (e) => {
      const val = parseFloat((e.target as HTMLInputElement).value)
      setter(val)
      this.showValue(id, val)
      this.notify && this.notify()
    }
  }

  showValue(element, value) {
    const label = document.querySelector(`label[for=${element}]`)
    label && (label.innerHTML = `${element}=${value}`)
  }
}
