import { expect } from "chai"
import { Session } from "../../src/network/client/session"
import { console as nodeConsole } from "node:console"

const jestConsole = globalThis.console

beforeEach(() => {
  globalThis.console = nodeConsole
})

afterEach(() => {
  globalThis.console = jestConsole
})

describe("Session", () => {
  it("instance created", () => {
    Session.init("c1", "u1", "t1", false)
    expect(Session.getInstance().clientId).to.equal("c1")
  })

  it("can set opponentName", () => {
    Session.init("c1", "u1", "t1", false)
    const session = Session.getInstance()
    session.opponentName = "Opponent"
    expect(session.opponentName).to.equal("Opponent")
  })

  it("initializes self score at 0", () => {
    Session.init("c1", "u1", "t1", false)
    expect(Session.getInstance().myScore()).to.equal(0)
  })

  it("assigns opponent id and defaults unknown score to 0", () => {
    Session.init("c1", "u1", "t1", false)
    const session = Session.getInstance()
    session.setOpponentClientId("c2")
    expect(session.getScoreByClientId("c2")).to.equal(0)
    expect(session.getScoreByClientId("unknown")).to.equal(0)
  })

  it("adds my and opponent scores explicitly", () => {
    Session.init("c1", "u1", "t1", false)
    const session = Session.getInstance()
    session.setOpponentClientId("c2")
    session.addMyScore(3)
    session.addOpponentScore(4)
    expect(session.myScore()).to.equal(3)
    expect(session.opponentScore()).to.equal(4)
  })

  it("uses a bot opponent in bot mode", () => {
    Session.init("c1", "u1", "t1", false, true)
    const session = Session.getInstance()
    expect(session.opponentName).to.equal("ClawBreak")
    expect(session.opponentParams["emoji"]).to.equal("🤖")
    expect(session.opponentScore()).to.equal(0)
  })

  describe("applyUrlParams", () => {
    it("parses opponent.userId and opponent.userName", () => {
      Session.init("c1", "u1", "t1", false)
      const session = Session.getInstance()
      session.applyUrlParams(
        new URLSearchParams("opponent.userId=c2&opponent.userName=Bob")
      )
      expect(session.opponentClientId).to.equal("c2")
      expect(session.opponentName).to.equal("Bob")
      expect(session.getScoreByClientId("c2")).to.equal(0)
    })

    it("parses opponent.custom.* and custom.* into param maps", () => {
      Session.init("c1", "u1", "t1", false)
      const session = Session.getInstance()
      session.applyUrlParams(
        new URLSearchParams(
          "opponent.custom.cue=1&custom.cue=2&custom.wall=red"
        )
      )
      expect(session.opponentParams).to.deep.equal({ cue: "1" })
      expect(session.customParams).to.deep.equal({ cue: "2", wall: "red" })
    })

    it("leaves opponent fields untouched when no params are present", () => {
      Session.init("c1", "u1", "t1", false)
      const session = Session.getInstance()
      session.setOpponentClientId("c2")
      session.applyUrlParams(new URLSearchParams(""))
      expect(session.opponentClientId).to.equal("c2")
      expect(session.opponentName).to.be.undefined
      expect(session.opponentParams).to.deep.equal({})
      expect(session.customParams).to.deep.equal({})
    })

    it("ignores opponent.userId equal to own clientId", () => {
      Session.init("c1", "u1", "t1", false)
      const session = Session.getInstance()
      session.applyUrlParams(new URLSearchParams("opponent.userId=c1"))
      expect(session.opponentClientId).to.be.undefined
      expect(session.opponentScore()).to.equal(0)
    })
  })

  describe("getRaceTargetForPlayer", () => {
    afterEach(() => {
      jest.restoreAllMocks()
    })

    it("returns ThreeCushionConfig.raceTo when no handicaps are defined", () => {
      Session.init("c1", "u1", "t1", false)
      const session = Session.getInstance()
      jest.spyOn(session, "getHandicaps").mockReturnValue({})

      const {
        ThreeCushionConfig,
      } = require("../../src/utils/threecushionconfig")
      const originalRaceTo = ThreeCushionConfig.raceTo
      try {
        ThreeCushionConfig.raceTo = 5
        expect(session.getRaceTargetForPlayer("c1")).to.equal(5)
      } finally {
        ThreeCushionConfig.raceTo = originalRaceTo
      }
    })

    it("returns custom handicap or default 5 when handicaps exist", () => {
      Session.init("c1", "u1", "t1", false)
      const session = Session.getInstance()
      jest.spyOn(session, "getHandicaps").mockReturnValue({ c1: 4 })

      expect(session.getRaceTargetForPlayer("c1")).to.equal(4)
      expect(session.getRaceTargetForPlayer("other")).to.equal(5)
    })
  })
})
