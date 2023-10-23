import { FourteenOne } from "./fourteenone"
import { NineBall } from "./nineball"
import { Snooker } from "./snooker"
import { ThreeCushion } from "./threecushion"

export class RuleFactory {
  static create(ruletype, container) {
    switch (ruletype) {
      case "threecushion":
        return new ThreeCushion(container)
      case "fourteenone":
        return new FourteenOne(container)
      case "snooker":
        return new Snooker(container)
      default:
        return new NineBall(container)
    }
  }
}
