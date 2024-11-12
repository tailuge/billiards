export interface State {
  P: number // Accumulated impulse
  WzI: number // Work done
  xG_dot: number
  yG_dot: number
  zG_dot: number
  θx_dot: number
  θy_dot: number
  θz_dot: number
  s: number // Slip speed at cushion
  sPrime: number // Slip speed at table
  phi: number // Slip angle at cushion
  phiPrime: number // Slip angle at table
}

export interface InitialConditions {
  V0: number // Initial velocity magnitude
  alpha: number // Incident angle (radians)
  w0T: number // Initial topspin angular velocity
  w0S: number // Initial sidespin angular velocity
}
