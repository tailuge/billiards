private setInitialConditions(V0: number, alpha: number, w0T: number, w0S: number): void {
    
    this.state = {
        P: 0,
        WzI: 0,
        xG_dot: V0 * Math.cos(alpha),
        yG_dot: V0 * Math.sin(alpha),
        zG_dot: 0,
        θx_dot: -w0T * Math.sin(alpha),
        θy_dot: w0T * Math.cos(alpha),
        θz_dot: w0S,
        s: 0,           
        phi: 0,         
        sPrime: 0,      
        phiPrime: 0     
    };

    this.state.s = this.calculateInitialSlipSpeed(this.state);
    this.state.phi = this.calculateInitialPhi(this.state);
    this.state.sPrime = Math.abs(V0 - R * w0T);
    this.state.phiPrime = this.calculatePhiPrime(V0, w0T);
}

// Slip speed calculation at cushion using initial state, based on Eq (12a) and (12b)
private calculateInitialSlipSpeed(state: State): number {
    const xI_dot = state.xG_dot + state.θy_dot * R * sinTheta - state.θz_dot * R * cosTheta;
    const yI_dot = -state.yG_dot * sinTheta + state.θx_dot * R;
    return Math.sqrt(xI_dot ** 2 + yI_dot ** 2);
}

// Slip angle phi at cushion derived from initial velocities at I
private calculateInitialPhi(state: State): number {
    const xI_dot = state.xG_dot + state.θy_dot * R * sinTheta - state.θz_dot * R * cosTheta;
    const yI_dot = -state.yG_dot * sinTheta + state.θx_dot * R;
    return Math.atan2(yI_dot, xI_dot);
}

// Slip angle phiPrime at table contact point C
private calculatePhiPrime(V0: number, w0T: number): number {
    return V0 > R * w0T ? alpha : (V0 < R * w0T ? Math.PI + alpha : NaN); // Undefined when V₀ = R * w0T
}
