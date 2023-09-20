export const g = 9.8
export let mu = 0.01
export let muS = 0.1
export let muC = 0.3
export let rho = 0.025
export let m = 0.22
export let R = 0.022
export let e = 0.86
export let Mz: number
export let Mxy: number
export let I: number

refresh()

function refresh() {
  Mz = ((mu * m * g * 2) / 3) * rho
  Mxy = (7 / (5 * Math.sqrt(2))) * R * mu * m * g
  I = (2 / 5) * m * R * R
}

export function setR(val: number) {
  R = val
  refresh()
}
export function setm(val: number) {
  m = val
  refresh()
}
export function setmu(val: number) {
  mu = val
  refresh()
}
export function setrho(val: number) {
  rho = val
  refresh()
}
export function setmuS(val: number) {
  muS = val
}
export function sete(val: number) {
  e = val
}
export function setmuC(val: number) {
  muC = val
}
