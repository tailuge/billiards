export let mu = 0.0055 // Han rolling friction
export let muS = 0.126 // Han sliding friction
export let rho = 0.045 // Han spindown rate

export let m = 0.23
export let R = 0.03275
export const g = 9.8

// Mathavan cushion coefficient of restitution
export let ee = 0.85

// Mathavan coefficient (table)
export let μs = 0.2

// Mathavan coefficient (cushion)
export let μw = 0.2

// Stronge slip stick ratio (cushion)
export let stronge_omega_ratio = 1.76

// Stronge restitution (cushion)
export let stronge_e_n = 0.77

// Stronge friction (cushion)
export let stronge_μ = 0.25

export let Mz: number
export let Mxy: number
export let I: number

export let muS_g: number
export let sliding_w_coeff: number
export let spindown_coeff: number
export let rolling_w_coeff_base: number

export let e = 0.86 // Han cushion coefficient of restitution - unused
export let muC = 0.85 // Han cushion friction- unused

// Fixed angle of cushion contact point above ball center
export const sinθ = 2 / 5
// Fixed angle of cushion contact point above ball center
export const cosθ = Math.sqrt(21) / 5

export const offCenterLimit = 0.45
export const maxPower = 160 * R

refresh()

function refresh() {
  Mz = ((mu * m * g * 2) / 3) * rho
  Mxy = (7 / (5 * Math.sqrt(2))) * R * mu * m * g
  I = (2 / 5) * m * R * R

  muS_g = muS * g
  sliding_w_coeff = (2.5 * muS_g) / R
  spindown_coeff = 2.5 * (Mz / (m * R * R))
  rolling_w_coeff_base = (5 / 7) * (Mxy / (m * R * R))
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
  refresh()
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

export function setstronge_omega_ratio(val: number) {
  stronge_omega_ratio = val
}
export function setstronge_e_n(val: number) {
  stronge_e_n = val
}
export function setstronge_μ(val: number) {
  stronge_μ = val
}
