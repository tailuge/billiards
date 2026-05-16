import { Table } from "../../src/model/table"
import { Outcome, OutcomeType } from "../../src/model/outcome"
import { NewRules, TransientState } from "../../src/newrules/types"

xdescribe("ThreeCushion Rules Engine - Success Scenario", () => {
  it("should declare a successful carom when 3 cushions and 2 collisions are detected", () => {
    // 1. Setup
    const table = new Table([]) // Simulation-centric, but allowed as input
    
    // Simulate: collision (0-1), 3 cushions, collision (0-2)
    const outcome: Outcome[] = [
      { type: OutcomeType.Collision, ballA: 0, ballB: 1 },
      { type: OutcomeType.Cushion },
      { type: OutcomeType.Cushion },
      { type: OutcomeType.Cushion },
      { type: OutcomeType.Collision, ballA: 0, ballB: 2 }
    ] as any

    // 2. Initial Transient State
    const initialState: TransientState = {
      currentBreak: 0,
      playerScore: 0,
      opponentScore: 0,
      data: { cueBallId: 0 } // The ball assigned to this player
    }

    // 3. Execution
    // const engine: NewRules = new ThreeCushionEngine()
    // const { result, nextTransientState } = engine.advance(table, initialState, outcome)

    // 4. Assertions
    // expect(result.flow).toBe('CONTINUE')
    // expect(result.potPoints).toBe(1)
    // expect(nextTransientState.currentBreak).toBe(1)
  })
})
