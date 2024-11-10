export interface Constants {
  M: number // Mass = 0.1406 kg
  R: number // Ball radius = 26.25 mm
  ee: number // Coefficient of restitution = 0.98
  μs: number // Coefficient of sliding friction (table) = 0.212
  μw: number // Coefficient of sliding friction (cushion) = 0.14
  sinTheta: number // Fixed angle of cushion contact point above ball center
  cosTheta: number // Fixed angle of cushion contact point above ball center
  N: number // Number of iterations
}

export const constants: Constants = {
  M: 0.1406,
  R: 0.02625,
  ee: 0.98,
  μs: 0.212,
  μw: 0.14,
  sinTheta: 2 / 5,
  cosTheta: Math.sqrt(21) / 5,
  N: 5000,
}
