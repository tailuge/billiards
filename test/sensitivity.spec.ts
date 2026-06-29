import { expect } from "chai"
import { Vector3 } from "three"
import { Ball } from "../src/model/ball"
import { Outcome } from "../src/model/outcome"
import {
  isThreeCushionScored,
  outcomeSignature,
  signaturesMatch,
  SimOutcome,
} from "../src/sensitivity"

/**
 * Phase 1 gate: the id-based isThreeCushionScored must agree with the canonical
 * Outcome.isThreeCushionPoint (src/model/outcome.ts) on the same scenarios.
 */

const CUE = 0
const B1 = 1
const B2 = 2

// --- helpers to build the two representations from a single scenario ----------

type Step =
  | { kind: "cushion"; ball: number }
  | { kind: "collision"; a: number; b: number }
  | { kind: "proximity"; a: number; b: number }

function toSimOutcomes(steps: Step[]): SimOutcome[] {
  return steps.map((s, i) => {
    if (s.kind === "cushion")
      return { type: "Cushion", ballA: s.ball, ballB: s.ball, t: i }
    if (s.kind === "collision")
      return { type: "Collision", ballA: s.a, ballB: s.b, t: i }
    return { type: "Proximity", ballA: s.a, ballB: s.b, t: i }
  })
}

function toCanonical(steps: Step[]): { cue: Ball; outcomes: Outcome[] } {
  const balls = new Map<number, Ball>()
  const ball = (id: number) => {
    if (!balls.has(id))
      balls.set(id, new Ball(new Vector3(0, 0, 0), 0xffffff, id))
    return balls.get(id)!
  }
  // ensure cue exists
  ball(CUE)
  const outcomes = steps.map((s, i) => {
    if (s.kind === "cushion") return Outcome.cushion(ball(s.ball), 1, i)
    if (s.kind === "collision")
      return Outcome.collision(ball(s.a), ball(s.b), 1, i)
    return Outcome.proximity(ball(s.a), ball(s.b), 0, i)
  })
  return { cue: ball(CUE), outcomes }
}

/** Assert id-based result matches canonical and equals `expected`. */
function check(steps: Step[], expected: boolean) {
  const sim = isThreeCushionScored(toSimOutcomes(steps), CUE)
  const { cue, outcomes } = toCanonical(steps)
  const canonical = Outcome.isThreeCushionPoint(cue, outcomes)
  expect(sim, "id-based vs expected").to.equal(expected)
  expect(sim, "id-based vs canonical").to.equal(canonical)
}

describe("isThreeCushionScored", () => {
  it("scores: 3 cushions then two distinct object balls", () => {
    check(
      [
        { kind: "cushion", ball: CUE },
        { kind: "cushion", ball: CUE },
        { kind: "cushion", ball: CUE },
        { kind: "collision", a: CUE, b: B1 },
        { kind: "collision", a: CUE, b: B2 },
      ],
      true
    )
  })

  it("fails: only 2 cushions before hitting the second ball", () => {
    check(
      [
        { kind: "cushion", ball: CUE },
        { kind: "cushion", ball: CUE },
        { kind: "collision", a: CUE, b: B1 },
        { kind: "collision", a: CUE, b: B2 },
      ],
      false
    )
  })

  it("scores: cushions counted after first ball, before second", () => {
    check(
      [
        { kind: "collision", a: CUE, b: B1 },
        { kind: "cushion", ball: CUE },
        { kind: "cushion", ball: CUE },
        { kind: "cushion", ball: CUE },
        { kind: "collision", a: CUE, b: B2 },
      ],
      true
    )
  })

  it("normalises reversed collision (object ball hits cue as ballB)", () => {
    check(
      [
        { kind: "cushion", ball: CUE },
        { kind: "cushion", ball: CUE },
        { kind: "cushion", ball: CUE },
        { kind: "collision", a: B1, b: CUE }, // reversed; cueBallFirst should fix
        { kind: "collision", a: CUE, b: B2 },
      ],
      true
    )
  })

  it("ignores cushions made by non-cue balls", () => {
    check(
      [
        { kind: "cushion", ball: CUE },
        { kind: "cushion", ball: B1 }, // not the cue — must not count
        { kind: "cushion", ball: B2 }, // not the cue — must not count
        { kind: "collision", a: CUE, b: B1 },
        { kind: "collision", a: CUE, b: B2 },
      ],
      false
    )
  })

  it("scores via proximity: 3 cushions, 1 collision, then proximity to 2nd ball", () => {
    check(
      [
        { kind: "cushion", ball: CUE },
        { kind: "cushion", ball: CUE },
        { kind: "cushion", ball: CUE },
        { kind: "collision", a: CUE, b: B1 },
        { kind: "proximity", a: CUE, b: B2 },
      ],
      true
    )
  })

  it("fails proximity when fewer than 3 cushions", () => {
    check(
      [
        { kind: "cushion", ball: CUE },
        { kind: "collision", a: CUE, b: B1 },
        { kind: "proximity", a: CUE, b: B2 },
      ],
      false
    )
  })

  it("fails on an empty outcome list", () => {
    check([], false)
  })
})

describe("outcomeSignature / signaturesMatch", () => {
  it("captures cushions, balls hit (encounter order), and scored", () => {
    const sig = outcomeSignature(
      toSimOutcomes([
        { kind: "cushion", ball: CUE },
        { kind: "cushion", ball: CUE },
        { kind: "cushion", ball: CUE },
        { kind: "collision", a: CUE, b: B1 },
        { kind: "collision", a: CUE, b: B2 },
      ]),
      CUE
    )
    expect(sig).to.deep.equal({
      cushions: 3,
      ballsHit: [B1, B2],
      scored: true,
    })
  })

  it("normalises reversed collisions and ignores non-cue cushions", () => {
    const sig = outcomeSignature(
      toSimOutcomes([
        { kind: "cushion", ball: B1 }, // not the cue — must not count
        { kind: "cushion", ball: CUE },
        { kind: "collision", a: B1, b: CUE }, // reversed — cueBallFirst fixes
      ]),
      CUE
    )
    expect(sig).to.deep.equal({
      cushions: 1,
      ballsHit: [B1],
      scored: false,
    })
  })

  it("a missed shot still produces a (non-scoring) signature", () => {
    const sig = outcomeSignature(
      toSimOutcomes([
        { kind: "cushion", ball: CUE },
        { kind: "collision", a: CUE, b: B1 },
      ]),
      CUE
    )
    expect(sig.scored).to.equal(false)
    expect(sig).to.deep.equal({ cushions: 1, ballsHit: [B1], scored: false })
  })

  it("signaturesMatch: equal for identical results, both missed", () => {
    const miss: SimOutcome[] = toSimOutcomes([
      { kind: "cushion", ball: CUE },
      { kind: "collision", a: CUE, b: B1 },
    ])
    expect(
      signaturesMatch(
        outcomeSignature(miss, CUE),
        outcomeSignature(miss, CUE)
      )
    ).to.equal(true)
  })

  it("signaturesMatch: differs on cushion count / balls hit / scored", () => {
    const base = outcomeSignature(
      toSimOutcomes([
        { kind: "cushion", ball: CUE },
        { kind: "cushion", ball: CUE },
        { kind: "cushion", ball: CUE },
        { kind: "collision", a: CUE, b: B1 },
        { kind: "collision", a: CUE, b: B2 },
      ]),
      CUE
    )
    const fewerCushions = outcomeSignature(
      toSimOutcomes([
        { kind: "cushion", ball: CUE },
        { kind: "cushion", ball: CUE },
        { kind: "collision", a: CUE, b: B1 },
        { kind: "collision", a: CUE, b: B2 },
      ]),
      CUE
    )
    expect(signaturesMatch(base, fewerCushions)).to.equal(false)
  })
})
