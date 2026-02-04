import { Mathaven } from "../model/physics/mathaven"
import { atan2 } from "../utils/utils"

export class HistoryMathaven extends Mathaven {
  readonly h: Array<Partial<Mathaven>> = []

  override updateSlipAngles(
    v_yI: number,
    v_xI: number,
    v_yC: number,
    v_xC: number
  ): void {
    this.φ = atan2(v_yI, v_xI)
    if (this.φ < 0) {
      this.φ += 2 * Math.PI
    }
    this.φʹ = atan2(v_yC, v_xC)
    if (this.φʹ < 0) {
      this.φʹ += 2 * Math.PI
    }
  }

  override updateSingleStep(ΔP: number): void {
    super.updateSingleStep(ΔP)
    this.h.push({ ...this })
  }

  public extractValues = (
    selector: (s: Partial<Mathaven>) => number | undefined
  ): number[] => {
    return this.h.map(selector).map((value) => value ?? 0)
  }
}
