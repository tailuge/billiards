import { Table } from "../../src/model/table"
import { Outcome } from "../../src/model/outcome"
import { NewRules, TransientState } from "../../src/controller/newrules/types"
import { Snooker } from "../../src/controller/newrules/snooker"

describe("Snooker Rules Engine", () => {
  it("should declare a win when the final black ball is potted", () => {
    // 1. Setup: Table with colors, but only black is relevant for phase
    const blackBall = { id: 6, onTable: () => false } as any
    const table = new Table([
      { id: 0, onTable: () => true }, // cue
      { id: 1, onTable: () => false },
      { id: 2, onTable: () => false },
      { id: 3, onTable: () => false },
      { id: 4, onTable: () => false },
      { id: 5, onTable: () => false },
      blackBall,
    ] as any)

    const outcome: Outcome[] = [Outcome.pot(blackBall, 1.0)]

    // 2. Initial Transient State
    const initialState: TransientState = {
      currentBreak: 0,
      playerScore: 100,
      opponentScore: 50,
      data: { phase: "BLACK" },
    }

    // 3. Execution
    const rules: NewRules = new Snooker()
    const { result, nextTransientState } = rules.advance(
      table,
      initialState,
      outcome
    )

    // 4. Assertions
    expect(result.flow).toBe("GAME_OVER")
    expect(result.winner).toBe("PLAYER")
    expect(nextTransientState.playerScore).toBe(107)
  })
})
