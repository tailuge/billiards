import { State } from './State';
import { M, R, ee, μs, μw, sinTheta, cosTheta, N } from "./constants"

export class NumericalSolution {
  
  private state: State;

  constructor(V0: number, alpha: number, w0T: number, w0S: number) {
    this.setInitialConditions(V0, alpha, w0T, w0S);
  }

  private setInitialConditions(V0: number, alpha: number, w0T: number, w0S: number): void {
    // Initial centroidal velocities 
    const xG_dot = V0 * Math.cos(alpha);
    const yG_dot = V0 * Math.sin(alpha);
    const zG_dot = 0;

    // Initial angular velocities
    const θx_dot = -w0T * Math.sin(alpha);
    const θy_dot = w0T * Math.cos(alpha);
    const θz_dot = w0S;

    // Initial slip speeds and angles
    const s = Math.sqrt(
      Math.pow((xG_dot + R * (θy_dot * sinTheta - θz_dot * cosTheta)), 2) +
      Math.pow((-yG_dot * sinTheta - R * θx_dot), 2)
    );

    const phi = Math.atan2(
      (-yG_dot * sinTheta - R * θx_dot),
      (xG_dot + R * (θy_dot * sinTheta - θz_dot * cosTheta))
    );

    const sPrime = Math.abs(V0 - R * w0T);

    let phiPrime;
    if (V0 - R * w0T > 0) {
      phiPrime = alpha;
    } else if (V0 - R * w0T < 0) {
      phiPrime = Math.PI + alpha;
    } else {
      phiPrime = undefined; // Rolling condition
    }

    this.state = {
      P: 0,
      WzI: 0,
      xG_dot,
      yG_dot,
      zG_dot,
      θx_dot,
      θy_dot,
      θz_dot,
      s,
      phi,
      sPrime,
      phiPrime
    };
  }

  public compressionPhase(): void {
    const deltaP = ((1 + ee) * M * this.state.yG_dot) / N; // Estimate deltaP for N iterations

    while (this.state.yG_dot > 0) { // Condition for compression phase
      this.updateSingleStep(deltaP);
    }
  }

  public restitutionPhase(): void {
    const targetWorkRebound = (1 - ee * ee) * this.state.WzI; 
    const deltaP = ((1 + ee) * M * this.state.yG_dot) / N; // Estimate deltaP for N iterations

    while (this.state.WzI > targetWorkRebound) { // Condition for restitution phase
      this.updateSingleStep(deltaP);
    }
  }

  private updateSingleStep(deltaP: number): void {
    // Common function to update velocities, angular velocities, and work done
    this.updateVelocities(deltaP);
    this.updateAngularVelocities(deltaP);
    this.updateWorkDone(deltaP);
    this.updateSlipValues();
  }

  private updateVelocities(deltaP: number): void {
    // Implement velocity updates based on equations 17a and 17b
    const { xG_dot, yG_dot, phi, phiPrime } = this.state;

    const deltaXG_dot = - (1 / M) * (μw * Math.cos(phi) + μs * Math.cos(phiPrime) * (sinTheta + μw * Math.sin(phi) * cosTheta)) * deltaP;
    const deltaYG_dot = - (1 / M) * (cosTheta - μw * Math.sin(phi) * sinTheta + μs * Math.sin(phiPrime) * (sinTheta + μw * Math.sin(phi) * cosTheta)) * deltaP;

    this.state.xG_dot += deltaXG_dot;
    this.state.yG_dot += deltaYG_dot;
    // zG_dot remains 0 (assumed)
  }

  private updateAngularVelocities(deltaP: number): void {
    // Implement angular velocity updates based on equations 14d, 14e, and 14f
    const { θx_dot, θy_dot, θz_dot, phi, phiPrime } = this.state;

    const deltaThetaX_dot = - (5 / (2 * M * R)) * (μw * Math.sin(phi) + μs * Math.sin(phiPrime) * (sinTheta + μw * Math.sin(phi) * cosTheta)) * deltaP;
    const deltaThetaY_dot = - (5 / (2 * M * R)) * (μw * Math.cos(phi) * sinTheta - μs * Math.cos(phiPrime) * (sinTheta + μw * Math.sin(phi) * cosTheta)) * deltaP;
    const deltaThetaZ_dot = (5 / (2 * M * R)) * (μw * Math.cos(phi) * cosTheta) * deltaP;

    this.state.θx_dot += deltaThetaX_dot;
    this.state.θy_dot += deltaThetaY_dot;
    this.state.θz_dot += deltaThetaZ_dot;
  }

  private updateWorkDone(deltaP: number): void {
    // Compute work done based on equation 16a
    const { WzI, zG_dot, θx_dot } = this.state;
    const zI_prime_new = -(this.state.yG_dot * sinTheta) + this.state.zG_dot * cosTheta + R * θx_dot;
    const zI_prime_old = -(this.state.yG_dot - (1 / M) * (cosTheta - μw * Math.sin(this.state.phi) * sinTheta + μs * Math.sin(this.state.phiPrime) * (sinTheta + μw * Math.sin(this.state.phi) * cosTheta)) * deltaP) * sinTheta + this.state.zG_dot * cosTheta + R * (this.state.θx_dot - (5 / (2 * M * R)) * (μw * Math.sin(this.state.phi) + μs * Math.sin(this.state.phiPrime) * (sinTheta + μw * Math.sin(this.state.phi) * cosTheta)) * deltaP);

    this.state.WzI = WzI + (deltaP / 2) * (zI_prime_new + zI_prime_old);
    this.state.P += deltaP;
  }

  private updateSlipValues(): void {
    const { xG_dot, yG_dot, θx_dot, θy_dot, θz_dot } = this.state;

    // Slip speed at cushion (Equation 12a, 12b)
    const xI_dot = xG_dot + R * (θy_dot * sinTheta - θz_dot * cosTheta);
    const yI_prime_dot = -yG_dot * sinTheta + this.state.zG_dot * cosTheta + R * θx_dot;

    this.state.s = Math.sqrt(Math.pow(xI_dot, 2) + Math.pow(yI_prime_dot, 2));
    this.state.phi = Math.atan2(yI_prime_dot, xI_dot);

    // Slip speed at table (Equation 13a, 13b)
    const xC_dot = xG_dot - R * θy_dot;
    const yC_dot = yG_dot + R * θx_dot;

    this.state.sPrime = Math.sqrt(Math.pow(xC_dot, 2) + Math.pow(yC_dot, 2));

    if (this.state.sPrime > 0) {
        this.state.phiPrime = Math.atan2(yC_dot, xC_dot);
    } else {
        this.state.phiPrime = undefined; // Rolling condition
    }
  }
}
