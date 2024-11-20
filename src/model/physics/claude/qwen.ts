import { M, R, ee, μs, μw, sinθ, cosθ, N } from "./constants"

export class Mathaven {
    P: number = 0;
    WzI: number = 0;

    // centroid velocity
    vx: number;
    vy: number;

    // angular velocity
    ωx: number;
    ωy: number;
    ωz: number;

    // slip speed and angles at I and C
    s: number;
    φ: number;
    sʹ: number;
    φʹ: number;

    i: number = 0

    readonly history: Array<Partial<Mathaven>> = [];

    constructor(v0: number, α: number, ω0S: number, ω0T: number) {
        this.vx = v0 * Math.cos(α);
        this.vy = v0 * Math.sin(α);
        this.ωx = -ω0T * Math.sin(α);
        this.ωy = ω0T * Math.cos(α);
        this.ωz = ω0S;
        this.updateSlipSpeedsAndAngles();
    }

    private updateSlipSpeedsAndAngles(): void {
        // Calculate velocities at the cushion (I)
        const v_xI = this.vx + this.ωy * R * sinθ - this.ωz * R * cosθ;
        const v_yI = -this.vy * sinθ + this.ωx * R;

        // Calculate velocities at the table (C)
        const v_xC = this.vx - this.ωy * R;
        const v_yC = this.vy + this.ωx * R;

        // Update slip speeds and angles at the cushion (I)
        this.s = Math.sqrt(Math.pow(v_xI, 2) + Math.pow(v_yI, 2));
        this.φ = Math.atan2(v_yI, v_xI);
        if (this.φ < 0) {
            this.φ += 2 * Math.PI;
        }
        // Update slip speeds and angles at the table (C)
        this.sʹ = Math.sqrt(Math.pow(v_xC, 2) + Math.pow(v_yC, 2));
        this.φʹ = Math.atan2(v_yC, v_xC);
        if (this.φʹ < 0) {
            this.φʹ += 2 * Math.PI;
        }
    }

    public compressionPhase(): void {
        const ΔP = Math.max((M * this.vy) / N,0.001)
        while (this.vy > 0) {
            this.updateSingleStep(ΔP);
        }
    }

    public restitutionPhase(targetWorkRebound: number): void {
        const ΔP = Math.max((targetWorkRebound) / N,0.001)
        this.WzI = 0
        while (this.WzI < targetWorkRebound) {
            this.updateSingleStep(ΔP);
        }
    }

    private updateSingleStep(ΔP: number): void {
        this.updateVelocity(ΔP);
        this.updateAngularVelocity(ΔP);
        this.updateSlipSpeedsAndAngles()
        this.updateWorkDone(ΔP);
        this.history.push({ ...this });
        if (this.i++ > 10 * N) {
            throw "Solution not found"
        }
    }

    private updateVelocity(ΔP: number): void {
        this.vx -= (1 / M) * (μw * Math.cos(this.φ) + μs * Math.cos(this.φʹ) * (sinθ + μw * Math.sin(this.φ) * cosθ)) * ΔP;
        this.vy -= (1 / M) * (cosθ - μw * sinθ * Math.sin(this.φ) + μs * Math.sin(this.φʹ) * (sinθ + μw * Math.sin(this.φ) * cosθ)) * ΔP;
    }

    private updateAngularVelocity(ΔP: number): void {
        this.ωx += -(5 / (2 * M * R)) * (μw * Math.sin(this.φ) + μs * Math.sin(this.φʹ) * (sinθ + μw * Math.sin(this.φ) * cosθ)) * ΔP;
        this.ωy += -(5 / (2 * M * R)) * (μw * Math.cos(this.φ) * sinθ - μs * Math.cos(this.φʹ) * (sinθ + μw * Math.sin(this.φ) * cosθ)) * ΔP;
        this.ωz += (5 / (2 * M * R)) * (μw * Math.cos(this.φ) * cosθ) * ΔP;
    }

    private updateWorkDone(ΔP: number): void {
        const ΔWzI = ΔP * Math.abs(this.vy);
        this.WzI += ΔWzI;
        this.P += ΔP;
    }

    public solve(): void {
        this.compressionPhase();
        const targetWorkRebound = this.WzI - (1 - ee * ee) * this.WzI;
        this.restitutionPhase(targetWorkRebound);
    }
}

