import { expect } from "chai"
import { Ball } from "../../src/model/ball"
import { Outcome } from "../../src/model/outcome"
import { zero } from "../../src/utils/three-utils"

describe("Outcome", () => {
  const cueBall = new Ball(zero)
  const yellow = new Ball(zero)
  const red = new Ball(zero)

  describe("isCaromPoint", () => {
    it("scores when the cue ball contacts both other balls", () => {
      const outcomes = [
        Outcome.collision(cueBall, yellow, 1, 0),
        Outcome.collision(cueBall, red, 1, 0),
      ]
      expect(Outcome.isCaromPoint(cueBall, outcomes)).to.be.true
    })

    it("ignores cushions, including reversed contact order", () => {
      const outcomes = [
        Outcome.cushion(cueBall, 1, 0),
        Outcome.collision(cueBall, yellow, 1, 0),
        Outcome.cushion(cueBall, 1, 0),
        Outcome.cushion(cueBall, 1, 0),
        Outcome.collision(red, cueBall, 1, 0),
        Outcome.cushion(cueBall, 1, 0),
      ]
      expect(Outcome.isCaromPoint(cueBall, outcomes)).to.be.true
    })

    it("does not score with a single contact", () => {
      const outcomes = [
        Outcome.cushion(cueBall, 1, 0),
        Outcome.collision(cueBall, red, 1, 0),
      ]
      expect(Outcome.isCaromPoint(cueBall, outcomes)).to.be.false
    })

    it("does not count the same ball twice", () => {
      const outcomes = [
        Outcome.collision(cueBall, yellow, 1, 0),
        Outcome.collision(yellow, cueBall, 1, 0),
        Outcome.collision(cueBall, yellow, 1, 0),
      ]
      expect(Outcome.isCaromPoint(cueBall, outcomes)).to.be.false
    })

    it("ignores contacts that do not involve the cue ball", () => {
      const outcomes = [
        Outcome.collision(yellow, red, 1, 0),
        Outcome.collision(red, yellow, 1, 0),
      ]
      expect(Outcome.isCaromPoint(cueBall, outcomes)).to.be.false
    })
  })

  describe("isThreeCushionPoint", () => {
    it("still requires three cushions before the second contact", () => {
      const withTwo = [
        Outcome.cushion(cueBall, 1, 0),
        Outcome.cushion(cueBall, 1, 0),
        Outcome.collision(cueBall, yellow, 1, 0),
        Outcome.collision(cueBall, red, 1, 0),
      ]
      expect(Outcome.isThreeCushionPoint(cueBall, withTwo)).to.be.false

      const withThree = [
        Outcome.cushion(cueBall, 1, 0),
        Outcome.cushion(cueBall, 1, 0),
        Outcome.cushion(cueBall, 1, 0),
        Outcome.collision(cueBall, yellow, 1, 0),
        Outcome.collision(cueBall, red, 1, 0),
      ]
      expect(Outcome.isThreeCushionPoint(cueBall, withThree)).to.be.true
    })
  })
})
