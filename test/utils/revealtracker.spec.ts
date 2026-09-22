import { expect } from "chai"
import { Vector3 } from "three"
import { Ball } from "../../src/model/ball"
import { Outcome } from "../../src/model/outcome"
import { RevealTracker } from "../../src/utils/revealtracker"

function fakeReveal(): { fractions: number[]; reveal(f: number): number } {
  const fractions: number[] = []
  return {
    fractions,
    reveal: (fraction: number) => fractions.push(fraction),
  }
}

/** The last requested fraction, expressed in whole fifteenths. */
const fifteenths = (reveal: { fractions: number[] }) =>
  reveal.fractions[reveal.fractions.length - 1] * 15

describe("RevealTracker", () => {
  const cueball = new Ball(new Vector3(0, 0, 0))
  const ball1 = new Ball(new Vector3(1, 0, 0))
  const ball9 = new Ball(new Vector3(2, 0, 0))

  it("fills as pots appear in the growing outcome", () => {
    const reveal = fakeReveal()
    const tracker = new RevealTracker(reveal, 15)
    const outcome: Outcome[] = []

    tracker.update(0, outcome, cueball)
    expect(fifteenths(reveal)).to.be.closeTo(0, 1e-9)

    outcome.push(Outcome.pot(ball1, 1))
    tracker.update(0, outcome, cueball)
    expect(fifteenths(reveal)).to.be.closeTo(1, 1e-9)

    outcome.push(Outcome.pot(ball9, 1))
    tracker.update(0, outcome, cueball)
    expect(fifteenths(reveal)).to.be.closeTo(2, 1e-9)
  })

  it("ignores a potted cue ball but still counts object balls", () => {
    const reveal = fakeReveal()
    const tracker = new RevealTracker(reveal, 15)
    const outcome: Outcome[] = []

    tracker.update(0, outcome, cueball)
    outcome.push(Outcome.pot(ball1, 1))
    outcome.push(Outcome.pot(cueball, 1))
    tracker.update(0, outcome, cueball)

    expect(fifteenths(reveal)).to.be.closeTo(1, 1e-9)
  })

  it("takes the max with the score, so a jumped score is honoured", () => {
    const reveal = fakeReveal()
    const tracker = new RevealTracker(reveal, 15)
    const outcome: Outcome[] = []

    tracker.update(0, outcome, cueball)
    outcome.push(Outcome.pot(ball1, 1))
    tracker.update(0, outcome, cueball)
    expect(fifteenths(reveal)).to.be.closeTo(1, 1e-9)

    // A replay ScoreEvent advances the score beyond the physics pot count.
    tracker.update(3, outcome, cueball)
    expect(fifteenths(reveal)).to.be.closeTo(3, 1e-9)
  })

  it("resets per shot without double counting the settled score", () => {
    const reveal = fakeReveal()
    const tracker = new RevealTracker(reveal, 15)

    const shot1: Outcome[] = []
    tracker.update(0, shot1, cueball)
    shot1.push(Outcome.pot(ball1, 1))
    tracker.update(0, shot1, cueball)
    expect(fifteenths(reveal)).to.be.closeTo(1, 1e-9)

    // New shot: baseline is the settled score of 1, no pots yet.
    const shot2: Outcome[] = []
    tracker.update(1, shot2, cueball)
    expect(fifteenths(reveal)).to.be.closeTo(1, 1e-9)

    shot2.push(Outcome.pot(ball9, 1))
    tracker.update(1, shot2, cueball)
    expect(fifteenths(reveal)).to.be.closeTo(2, 1e-9)
  })
})
