import { Container } from "../../container/container"
import { End } from "../end"
import { MatchResultHelper } from "../../network/client/matchresult"

export class SnookerScoring {
  static presentGameEnd(
    container: Container,
    rulename: string,
    isWinner?: boolean,
    endSubtext?: string
  ): End {
    return MatchResultHelper.presentGameEnd(
      container,
      rulename,
      isWinner,
      endSubtext
    )
  }
}
