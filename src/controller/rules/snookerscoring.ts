import { Container } from "../../container/container"
import { End } from "../end"
import { MatchResultHelper } from "../../network/client/matchresult"

export class SnookerScoring {
  static presentGameEnd(
    container: Container,
    rulename: string,
    endSubtext?: string
  ): End {
    return MatchResultHelper.presentGameEnd(
      container,
      rulename,
      undefined,
      endSubtext
    )
  }
}
