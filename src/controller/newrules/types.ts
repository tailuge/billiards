import { Table } from "../../model/table"
import { Outcome } from "../../model/outcome"

export type Flow = "CONTINUE" | "SWITCH" | "GAME_OVER"
export type Action = "START_AIM" | "PLACE_BALL" | "NONE"
export type Actor = "PLAYER" | "OPPONENT"

export interface TransientState {
  currentBreak: number
  playerScore: number
  opponentScore: number
  data: Record<string, any>
}

export interface RuleCommand {
  type: "SET_PLAYER_GROUP" | "TRIGGER_NOTIFICATION" | "RESPOT"
  payload?: any
}

export interface RuleResult {
  flow: Flow
  action: Action
  winner?: Actor
  potPoints?: number
  foulPoints?: number
  commands: RuleCommand[]
}

export interface NewRules {
  advance(
    table: Table,
    transientState: TransientState,
    outcome: Outcome[]
  ): {
    result: RuleResult
    nextTransientState: TransientState
  }
}
