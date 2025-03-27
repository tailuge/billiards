export const g = 9.8
export let mu = 0.00985
export let muS = 0.16
export let muC = 0.85
export let rho = 0.034
export let m = 0.23
export let R = 0.03275
export let e = 0.86

// Mathaven specific
// Coefficient of restitution
export let ee = 0.98

// Coefficient of sliding friction (table)
export let μs = 0.212

// Coefficient of sliding friction (cushion)
export let μw = 0.14

export let Mz: number
export let Mxy: number
export let I: number

// Fixed angle of cushion contact point above ball center
export const sinθ = 2 / 5
// Fixed angle of cushion contact point above ball center
export const cosθ = Math.sqrt(21) / 5

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
export function setμs(val: number) {
  μs = val
}
export function setμw(val: number) {
  μw = val
}
export function setee(val: number) {
  ee = val
}
