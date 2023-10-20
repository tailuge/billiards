import { Rack } from "../../utils/rack"
import { NineBall } from "./nineball"
import { Rules } from "./rules"

export class FourteenOne extends NineBall implements Rules {
  override rack() {
    return Rack.triangle()
  }
}
