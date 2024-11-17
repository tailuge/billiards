
import { State } from './state';
import { M, R, ee, μs, μw, sinTheta, cosTheta, N } from "./constants"

export class NumericCalculation {

    private state: State;
    public readonly history:State[] = [];

    constructor(V0: number, alpha: number, w0T: number, w0S: number) {
        console.log(V0 * Math.sin(alpha))
        this.setInitialConditions(V0, alpha, w0T, w0S);
    }

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
            s: this.calculateInitialSlipSpeedI(V0, alpha, w0T, w0S),
            phi: this.calculateInitialSlipAngleI(V0, alpha, w0T, w0S),
            sPrime: this.calculateInitialSlipSpeedC(V0, w0T),
            phiPrime: this.calculateInitialSlipAngleC(V0, alpha, w0T),
        };
        console.log(JSON.stringify(this.state))
    }


    private calculateInitialSlipSpeedI(V0: number, alpha: number, w0T: number, w0S: number): number {
        const term1 = V0 * Math.cos(alpha) + R * (w0T * Math.cos(alpha) * sinTheta - w0S * cosTheta);
        const term2 = -V0 * Math.sin(alpha) * sinTheta - R * w0T * Math.sin(alpha);
        return Math.sqrt(term1 * term1 + term2 * term2);
    }


    private calculateInitialSlipSpeedC(V0: number, w0T: number): number {
        return Math.abs(V0 - R * w0T);
    }

    private calculateInitialSlipAngleI(V0: number, alpha: number, w0T: number, w0S: number): number {
        const term1 = -V0 * Math.sin(alpha) * sinTheta - R * w0T * Math.sin(alpha);
        const term2 = V0 * Math.cos(alpha) + R * (w0T * Math.cos(alpha) * sinTheta - w0S * cosTheta);
        return Math.atan2(term1, term2);
    }

    private calculateInitialSlipAngleC(V0: number, alpha: number, w0T: number): number {
        const diff = V0 - R * w0T;
        if (diff > 0) {
            return alpha;
        } 
        return Math.PI + alpha;   
    }




    public compressionPhase(): State {
        const deltaP = (1 + ee) * M * this.state.yG_dot / N; //yG_dot is V0*sin(alpha) initially
console.log("deltaP"+deltaP)
        while (this.state.yG_dot > 0) {
            this.updateSingleStep(deltaP);
        }
        return this.state;
    }

    public restitutionPhase(targetWorkRebound: number): State {

        const deltaP = (1 + ee) * M * this.state.yG_dot / N;
        while (this.state.WzI < targetWorkRebound) {
            this.updateSingleStep(deltaP);
        }
        return this.state
    }
private iter=0
    private updateSingleStep(deltaP: number): void {
        this.updateVelocities(deltaP);
        this.updateAngularVelocities(deltaP);
        this.updateSlipVelocities();
        this.updateWorkDone(deltaP);
        this.history.push({...this.state});
        this.state.P += deltaP;
        if (this.iter++ > 2000) {
            console.log(this.state)
            throw "Solution not found"
          }
    }

    private updateVelocities(deltaP: number): void {
        // Equations 17a and a similar equation for y (not explicitly given in the paper)
        this.state.xG_dot -= (1 / M) * (μw * Math.cos(this.state.phi) + μs * Math.cos(this.state.phiPrime) * (sinTheta + μw * Math.sin(this.state.phi) * cosTheta)) * deltaP;
        this.state.yG_dot -= (1 / M) * (cosTheta - μw * sinTheta * Math.sin(this.state.phi) + μs * Math.sin(this.state.phiPrime) * (sinTheta + μw * Math.sin(this.state.phi) * cosTheta)) * deltaP;
    }

    private updateAngularVelocities(deltaP: number): void {
        // Equations 14d, 14e, 14f
        this.state.θx_dot -= (5 / (2 * M * R)) * (μw * Math.sin(this.state.phi) + μs * Math.sin(this.state.phiPrime) * (sinTheta + μw * Math.sin(this.state.phi) * cosTheta)) * deltaP;
        this.state.θy_dot -= (5 / (2 * M * R)) * (μw * Math.cos(this.state.phi) * sinTheta - μs * Math.cos(this.state.phiPrime) * (sinTheta + μw * Math.sin(this.state.phi) * cosTheta)) * deltaP;
        this.state.θz_dot += (5 / (2 * M * R)) * (μw * Math.cos(this.state.phi) * cosTheta) * deltaP;
    }


    private updateSlipVelocities(): void {
        // Recalculate slip velocities and angles using equations 12 and 13
        const xI_dot = this.state.xG_dot + this.state.θy_dot * R * sinTheta - this.state.θz_dot * R * cosTheta;
        const yI_dot_prime = -this.state.yG_dot * sinTheta + this.state.zG_dot * cosTheta + this.state.θx_dot * R;


        this.state.s = Math.sqrt(xI_dot * xI_dot + yI_dot_prime * yI_dot_prime);
        this.state.phi = Math.atan2(yI_dot_prime, xI_dot);

        const xC_dot = this.state.xG_dot - this.state.θy_dot * R;
        const yC_dot = this.state.yG_dot + this.state.θx_dot * R;

        this.state.sPrime = Math.sqrt(xC_dot * xC_dot + yC_dot * yC_dot);
        this.state.phiPrime = Math.atan2(yC_dot, xC_dot);

    }

    private updateWorkDone(deltaP: number): void {
        // Equation 16a  Wz' needs the z' velocity
        const zI_dot_prime = -this.state.yG_dot * cosTheta - this.state.zG_dot * sinTheta;

        this.state.WzI += (deltaP / 2) * (zI_dot_prime) * 2;
    }

    public solve(): State {
        
        const compressionState = this.compressionPhase();
        console.log("Compression state complete at ", this.iter);

        // Calculate target work rebound using equation 16b
        const targetWorkRebound = (0.8) * compressionState.WzI;
        console.log("WzI", compressionState.WzI)
        console.log("Target work rebound: ", targetWorkRebound);
        const restitutionState = this.restitutionPhase(targetWorkRebound);
        return restitutionState;
    }
}

