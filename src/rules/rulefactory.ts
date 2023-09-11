import { NineBall } from "./nineball"

export class RuleFactory {
  static create(ruletype, container) {
    if (ruletype === "nineball") {
      return new NineBall(container)
    }
    return new NineBall(container)
  }
}
