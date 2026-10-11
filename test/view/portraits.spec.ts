import { expect } from "chai"
import { portraitSpecs } from "../../src/view/portraits"
import { Session } from "../../src/network/client/session"

describe("Portraits", () => {
  afterEach(() => {
    globalThis.history.replaceState({}, "", "/")
  })

  const soloMode = { roomVisible: true, singlePlayer: true }

  it("puts the club name on the plaque instead of the player name", () => {
    globalThis.history.replaceState(
      {},
      "",
      "?club=matsuyama&clubName=" + encodeURIComponent("松山ビリヤード")
    )
    const session = new Session("tailuge", "id", "1", false)
    const specs = portraitSpecs(soloMode, session, 3)
    expect(specs[0].name).to.equal("松山ビリヤード")
  })

  it("falls back to the player name when there is no club", () => {
    const session = new Session("tailuge", "id", "1", false)
    const specs = portraitSpecs(soloMode, session, 3)
    expect(specs[0].name).to.equal("tailuge")
  })
})
