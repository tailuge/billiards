import { GameEvent } from "./gameevent"

export interface RecordEntry {
  state: number[]
  event: GameEvent
  pots: number
  isPartOfBreak: boolean
  time: number
}
