import { Mathaven } from "../model/physics/mathaven"

export class HistoryMathaven extends Mathaven {
  readonly h: Array<Partial<Mathaven>> = []

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
