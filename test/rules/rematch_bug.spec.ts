import { expect } from "chai"
import { Container } from "../../src/container/container"
import { BrowserContainer } from "../../src/container/browsercontainer"
import { initDom } from "../view/dom"
import { Assets } from "../../src/view/assets"
import { Session } from "../../src/network/client/session"
import { Rematch } from "../../src/network/client/rematch"

initDom()

describe("Rematch Bug Reproduction", () => {
  beforeEach(() => {
    Session.reset()
    // Mock canvas
    if (!document.getElementById("canvas3d")) {
      const canvas = document.createElement("canvas")
      canvas.id = "canvas3d"
      document.body.appendChild(canvas)
    }
  })

  afterEach(() => {
    Session.reset()
  })

  it("reproduces score loss when userId is not preserved across reload", () => {
    // 1. Initial Session (User visits without ?userId=...)
    const initialParams = new URLSearchParams()
    initialParams.set("playername", "PlayerOne")
    // Note: NO "userId" set here!

    // Initialize BrowserContainer with mocked canvas
    const bc1: any = new BrowserContainer(
      document.getElementById("canvas3d"),
      initialParams
    )
    
    // Stub onAssetsReady/createContainer to avoid full game loop
    bc1["createContainer"] = function(scoreReporter: any) {
        return new Container({
            element: bc1.canvas3d,
            log: () => {},
            assets: Assets.localAssets("nineball"),
            ruletype: "nineball",
            scoreReporter: scoreReporter
        })
    }
    bc1.assets = Assets.localAssets("nineball")
    bc1.onAssetsReady()
    
    const session1 = Session.getInstance()
    const originalClientId = session1.clientId
    
    // Verify we have a generated ID (starts with G_)
    expect(originalClientId).to.match(/^G_/)

    // 2. Simulate Playing and Winning a Game
    // Manually set rematchInfo as if MatchResultHelper did it
    session1.rematchInfo = {
        opponentId: "OpponentID",
        opponentName: "OpponentName",
        ruleType: "nineball",
        lastScores: [
            { userId: originalClientId, score: 1 },
            { userId: "OpponentID", score: 0 }
        ],
        nextTurnId: "OpponentID"
    }

    // Verify local score tracking works
    expect(Rematch.getOrderedScores(session1).p1).to.equal(1)

    // 3. Simulate "Rematch" Click & Redirect Logic (The FIX)
    const encodedRematch = encodeURIComponent(JSON.stringify(session1.rematchInfo))
    
    // Now simulate the corrected logic
    const newParams = new URLSearchParams()
    newParams.set("rematch", encodedRematch)
    newParams.set("userId", session1.clientId) // This is now preserved by getPreservedParams
    newParams.set("userName", session1.playername)
    
    // Reset Session to simulate page reload
    Session.reset()

    // 4. New Session (Rematch)
    const bc2: any = new BrowserContainer(
        document.getElementById("canvas3d"),
        newParams
    );
    
    // Stub setup again
    bc2["createContainer"] = bc1["createContainer"]
    bc2.assets = Assets.localAssets("nineball")
    browserContainer2onAssetsReady(bc2) // Extracted to a helper if possible or just repeat the calls

    const session2 = Session.getInstance()
    const newClientId = session2.clientId

    // Verify IDs are now THE SAME
    expect(newClientId).to.equal(originalClientId)

    // 5. Verify the Data is PRESERVED
    // The new session has the rematch info...
    expect(session2.rematchInfo).to.not.be.undefined
    
    // ...and it matches the score to the preserved ID!
    const scores = Rematch.getOrderedScores(session2)
    
    expect(scores.p1).to.equal(1, "Score should be 1 because identity was preserved")
  })
})

function browserContainer2onAssetsReady(bc: any) {
    bc.onAssetsReady()
}
