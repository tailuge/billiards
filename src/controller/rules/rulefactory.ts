import { NineBall } from "./nineball"
import { ThreeCushion } from "./threecushion"

export class RuleFactory {
  static create(ruletype, container) {
    if (ruletype === "threecushion") {
      return new ThreeCushion(container)
    }
    return new NineBall(container)
  }
}
