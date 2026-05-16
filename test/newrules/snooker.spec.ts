import { Table } from "../../src/model/table"
import { Outcome } from "../../src/model/outcome"
import { NewRules } from "../../src/newrules/types"

xdescribe("Snooker Rules Engine", () => {
  it("should declare a win when the final black ball is potted", () => {
    // 1. Setup: Table with no balls except black (simulated)
    const table = new Table([]) // We will need to mock/stub table state
    const outcome: Outcome[] = [] // Mocked outcome: black potted

    // 2. Initial Transient State
    const initialState = {
      currentBreak: 0,
      data: { phase: 'BLACK' }
    }

    // 3. Execution
    // const engine: NewRules = new SnookerEngine()
    // const { result, nextTransientState } = engine.advance(table, initialState, outcome)

    // 4. Assertions
    // expect(result.flow).toBe('GAME_OVER')
    // expect(result.winner).toBe('PLAYER')
  })
})
