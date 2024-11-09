
interface InitialConditions {
  V0: number;          // Initial velocity magnitude
  alpha: number;       // Incident angle (degrees)
  w0T: number;         // Initial topspin angular velocity
  w0S: number;         // Initial sidespin angular velocity
}

interface Constants {
  M: number;           // Mass = 0.1406 kg
  R: number;           // Ball radius = 26.25 mm
  ee: number;          // Coefficient of restitution = 0.98
  μs: number;          // Coefficient of sliding friction (table) = 0.212
  μw: number;          // Coefficient of sliding friction (cushion) = 0.14
  theta: number;       // Cushion angle where sin(θ) = 2/5
  N: number;           // Number of iterations
}

class CompressionPhase {
  private readonly constants: Constants = {
    M: 0.1406,
    R: 0.02625,
    ee: 0.98,
    μs: 0.212,
    μw: 0.14,
    theta: Math.asin(0.4), // sin(θ) = 2/5
    N: 5000
  };

  // State variables during compression
  private xG_dot: number = 0;    // ẋG - x component of centroid velocity
  private yG_dot: number = 0;    // ẏG - y component of centroid velocity
  private zG_dot: number = 0;    // żG - z component of centroid velocity (always 0)
  
  private θx_dot: number = 0;    // θ̇x - angular velocity around x-axis
  private θy_dot: number = 0;    // θ̇y - angular velocity around y-axis
  private θz_dot: number = 0;    // θ̇z - angular velocity around z-axis

  private PI: number = 0;        // Accumulated impulse
  private WZI: number = 0;       // Work done at point I
  private ΔPI: number = 0;       // Impulse increment

  constructor(initial: InitialConditions) {
    this.setInitialConditions(initial);
  }

  private setInitialConditions(initial: InitialConditions): void {
    const { V0, alpha, w0T, w0S } = initial;
    const alphaRad = alpha * Math.PI / 180;

    // Initial centroid velocities (from paper's Initial Conditions)
    this.xG_dot = V0 * Math.cos(alphaRad);
    this.yG_dot = V0 * Math.sin(alphaRad);
    this.zG_dot = 0;

    // Initial angular velocities
    this.θx_dot = -w0T * Math.sin(alphaRad);
    this.θy_dot = w0T * Math.cos(alphaRad);
    this.θz_dot = w0S;

    // Calculate impulse increment
    this.ΔPI = (1 + this.constants.ee) * this.constants.M * V0 * 
               Math.sin(alphaRad) / this.constants.N;
  }

  private calculateSlipVelocities(): { s: number, sPrime: number, phi: number, phiPrime: number } {
    const { R, theta } = this.constants;

    // Slip velocity at cushion (point I) - Equations 12a, 12b
    const xI_dot = this.xG_dot + 
                   this.θy_dot * R * Math.sin(theta) - 
                   this.θz_dot * R * Math.cos(theta);
    
    const yI_prime_dot = -this.yG_dot * Math.sin(theta) + 
                         this.zG_dot * Math.cos(theta) + 
                         this.θx_dot * R;

    // Slip velocity at table (point C) - Equations 13a, 13b
    const xC_dot = this.xG_dot - this.θy_dot * R;
    const yC_dot = this.yG_dot + this.θx_dot * R;

    // Calculate slip speeds
    const s = Math.sqrt(xI_dot * xI_dot + yI_prime_dot * yI_prime_dot);
    const sPrime = Math.sqrt(xC_dot * xC_dot + yC_dot * yC_dot);

    // Calculate slip angles
    const phi = Math.atan2(yI_prime_dot, xI_dot);
    const phiPrime = Math.atan2(yC_dot, xC_dot);

    return { s, sPrime, phi, phiPrime };
  }

  private updateVelocities(): void {
    const { M, μw, μs, theta } = this.constants;
    const { phi, phiPrime } = this.calculateSlipVelocities();

    // Update x-component velocity - Equation 17a
    const ΔxG_dot = -(1/M) * (
      μw * Math.cos(phi) + 
      μs * Math.cos(phiPrime) * (Math.sin(theta) + μw * Math.sin(phi) * Math.cos(theta))
    ) * this.ΔPI;

    // Update y-component velocity
    const ΔyG_dot = -(1/M) * (
      Math.cos(theta) - 
      μw * Math.sin(theta) * Math.sin(phi) + 
      μs * Math.sin(phiPrime) * (Math.sin(theta) + μw * Math.sin(phi) * Math.cos(theta))
    ) * this.ΔPI;

    this.xG_dot += ΔxG_dot;
    this.yG_dot += ΔyG_dot;

    // Update work done - Equation 16a
    const zI_prime_dot = -this.yG_dot * Math.sin(theta);
    this.WZI += this.ΔPI * zI_prime_dot;
    this.PI += this.ΔPI;
  }

  simulateCompression(): { 
    PI_c: number,      // Accumulated impulse at end of compression
    WZI_c: number      // Work done at end of compression
  } {
    let compressionComplete = false;
    let iteration = 0;

    while (!compressionComplete && iteration < this.constants.N) {
      const prevZI_prime_dot = -this.yG_dot * Math.sin(this.constants.theta);
      this.updateVelocities();
      const newZI_prime_dot = -this.yG_dot * Math.sin(this.constants.theta);

      // Compression phase ends when żᵢ' = 0
      if (prevZI_prime_dot > 0 && newZI_prime_dot <= 0) {
        compressionComplete = true;
      }

      iteration++;
    }

    return {
      PI_c: this.PI,    // P_I^c in paper
      WZI_c: this.WZI   // W_Z'^I(P_I^c) in paper
    };
  }

  // Get final velocities at end of compression
  getFinalVelocities(): { 
    xG_dot: number,    // ẋG
    yG_dot: number,    // ẏG
    θx_dot: number,    // θ̇x
    θy_dot: number,    // θ̇y
    θz_dot: number     // θ̇z
  } {
    return {
      xG_dot: this.xG_dot,
      yG_dot: this.yG_dot,
      θx_dot: this.θx_dot,
      θy_dot: this.θy_dot,
      θz_dot: this.θz_dot
    };
  }
}

export { CompressionPhase, type InitialConditions, type Constants };