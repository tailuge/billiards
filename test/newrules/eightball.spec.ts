import { Table } from "../../src/model/table"
import { Outcome } from "../../src/model/outcome"
import { NewRules, TransientState } from "../../src/controller/newrules/types"

xdescribe("EightBall Rules Engine - Foul Scenario", () => {
  it("should handle potting the 8-ball early as a foul and switch control", () => {
    // 1. Setup
    // Table with 8-ball and other group balls (simplified simulation)
    const table = new Table([])
    const outcome: Outcome[] = [] // Mock: 8-ball potted, but still objects remaining

    // 2. Initial Transient State
    const initialState: TransientState = {
      currentBreak: 0,
      playerScore: 0,
      opponentScore: 0,
      data: { group: "STRIPE" },
    }

    // 3. Execution
    // const rules: NewRules = new EightBall()
    // const { result, nextTransientState } = rules.advance(table, initialState, outcome)

    // 4. Assertions
    // expect(result.flow).toBe('SWITCH')
    // expect(result.action).toBe('PLACE_BALL') // Ball in hand
    // expect(result.commands).toContainEqual(expect.objectContaining({ type: 'RESPOT' }))
    // expect(result.foulPoints).toBeGreaterThan(0)
  })
})
