import { Table } from "../../model/table"
import { Outcome } from "../../model/outcome"
import { NewRules, TransientState, RuleResult } from "./types"
import { SnookerUtils } from "../rules/snookerutils"

export class Snooker implements NewRules {
  advance(
    table: Table,
    transientState: TransientState,
    outcome: Outcome[]
  ): { result: RuleResult; nextTransientState: TransientState } {
    if (Outcome.potCount(outcome) === 1) {
      const potted = Outcome.pots(outcome)[0]
      const colorsOnTable = SnookerUtils.coloursOnTable(table)

      if (colorsOnTable.some((ball) => ball.id < potted.id)) {
        const foulPoints = Math.max(4, potted.id + 1)
        return {
          result: {
            flow: "SWITCH",
            action: "START_AIM",
            foulPoints,
            commands: [{ type: "RESPOT", payload: potted.id }],
          },
          nextTransientState: {
            ...transientState,
            opponentScore: transientState.opponentScore + foulPoints,
            currentBreak: 0,
          },
        }
      }

      if (transientState.data.phase === "BLACK" && potted.id === 6) {
        const finalScore = transientState.playerScore + 7
        return {
          result: {
            flow: "GAME_OVER",
            action: "NONE",
            winner:
              finalScore >= transientState.opponentScore
                ? "PLAYER"
                : "OPPONENT",
            potPoints: 7,
            commands: [],
          },
          nextTransientState: {
            ...transientState,
            playerScore: finalScore,
            currentBreak: transientState.currentBreak + 1,
          },
        }
      }
    }
    return {
      result: {
        flow: "CONTINUE",
        action: "NONE",
        commands: [],
      },
      nextTransientState: { ...transientState },
    }
  }
}
