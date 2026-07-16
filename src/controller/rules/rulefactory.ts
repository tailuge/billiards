import { NineBall } from "./nineball"
import { EightBall } from "./eightball"
import { Rules } from "./rules"
import { Snooker } from "./snooker"
import { ThreeCushion } from "./threecushion"
import { Drill } from "./drill"
import { Sagu } from "./sagu"

export class RuleFactory {
  static create(ruletype, container): Rules {
    switch (ruletype) {
      case "threecushion":
        return new ThreeCushion(container)
      case "sagu":
        return new Sagu(container)
      case "threecushion-drill":
        return new Drill(container)
      case "eightball":
        return new EightBall(container)
      case "snooker":
        return new Snooker(container)
      default:
        return new NineBall(container)
    }
  }
}
