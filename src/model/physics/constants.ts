export const g = 9.8
export let mu = 0.00985
export let muS = 0.15
export let muC = 0.8
export let rho = 0.024
export let m = 0.23
export let R = 0.03275
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
