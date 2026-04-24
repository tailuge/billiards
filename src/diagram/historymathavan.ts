import { Mathavan } from "../model/physics/mathavan"

export class HistoryMathavan extends Mathavan {
  readonly h: Array<Partial<Mathavan>> = []

  override updateSingleStep(ΔP: number): void {
    super.updateSingleStep(ΔP)
    this.h.push({ ...this })
  }

  public extractValues = (
    selector: (s: Partial<Mathavan>) => number | undefined
  ): number[] => {
    return this.h.map(selector).map((value) => value ?? 0)
  }
}
