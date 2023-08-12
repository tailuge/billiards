export const mu = 0.29
export const muSlide = 0.89
export const g = 9.8
export const rho = 0.15
export let m = 0.1
export let R = 0.5
export let Mz = ((mu * m * g * 2) / 3) * rho
export let Mxy = (7 / (5 * Math.sqrt(2))) * R * mu * m * g
export const e = 0.85
export let I = (2 / 5) * m * R * R

export function setR(x) {
  R = x
}

export function setm(x) {
  m = x
}
