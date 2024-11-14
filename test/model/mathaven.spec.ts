import "mocha"
import { expect } from "chai"
import { CompressionPhase } from "../../src/model/physics/claude/claude"
import { NumericCalculation } from "../../src/model/physics/claude/gpt4o"

const t = 0.1

const jestConsole = console

beforeEach(() => {
  global.console = require("console")
})

afterEach(() => {
  global.console = jestConsole
})

const TOLERANCE = 0.1
const impulseIncrement = 0.02

describe("Mathavan Cushion - Billiard Ball Dynamics", () => {
  it("directly into cushion", (done) => {
    const initial = {
      V0: 2.0, // 2 m/s initial velocity
      alpha: Math.PI / 2, // 0 degrees (perpendicular to cushion??)
      w0T: 0, // no topspin
      w0S: 0, // no sidespin
    }

    const compression = new CompressionPhase(initial)
    const { yG_dot } = compression.completeCompressionPhase()

    expect(yG_dot).to.be.lessThan(0)
    done()
  })

  it("claude", (done) => {
    const initial = {
      V0: 2.0, // 2 m/s initial velocity
      alpha: Math.PI / 4, // 45 degrees
      w0T: 0, // no topspin
      w0S: 0, // no sidespin
    }

    const compression = new CompressionPhase(initial)
    const { xG_dot, yG_dot } = compression.completeCompressionPhase()

    expect(yG_dot).to.be.lessThan(0)
    expect(xG_dot).to.be.lessThan(2)
    done()
  })

  it("directly into cushion gpt4o", (done) => {
    const initial = {
      V0: 2.0, // 2 m/s initial velocity
      alpha: Math.PI / 2, // 0 degrees but 90? (perpendicular to cushion??)
      w0T: 0, // no topspin
      w0S: 0, // no sidespin
    }

    const numericCalculation = new NumericCalculation(2.0, Math.PI / 2, 0, 0)
    const state = numericCalculation.solve()

    expect(state.yG_dot).to.be.lessThan(0)
    done()
  })
})
