import { Controller, BeginEvent } from "./controller"
import { Init } from "./init";

export class End extends Controller {
  handleBegin(_: BeginEvent): Controller {
    return new Init(this.container)
  }
}
