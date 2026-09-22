import { expect } from "chai"
import {
  RevealTexture,
  TILE_SIZE,
  revealCount,
  tileRect,
} from "../../src/view/revealtexture"

describe("RevealTexture", () => {
  it("reveals whole tiles for a fraction", () => {
    expect(revealCount(0)).to.equal(0)
    expect(revealCount(0.3)).to.equal(10)
    expect(revealCount(1 / 32)).to.equal(1)
    expect(revealCount(0.5)).to.equal(16)
    expect(revealCount(1)).to.equal(32)
    expect(revealCount(-1)).to.equal(0)
    expect(revealCount(2)).to.equal(32)
    expect(revealCount(NaN)).to.equal(0)
  })

  it("tiles the whole image exactly once", () => {
    const seen = new Set<string>()
    let area = 0
    for (let i = 0; i < 32; i++) {
      const { x, y } = tileRect(i)
      expect(x).to.be.lessThan(512)
      expect(y).to.be.lessThan(256)
      seen.add(`${x},${y}`)
      area += TILE_SIZE * TILE_SIZE
    }
    expect(seen.size).to.equal(32)
    expect(area).to.equal(512 * 256)
  })

  it("only loads an image when ?image= is supplied", () => {
    const originalSearch = globalThis.location.search
    try {
      globalThis.history.replaceState({}, "", "?tableSize=5")
      expect(RevealTexture.fromLocation()).to.be.null

      globalThis.history.replaceState({}, "", "?image=assets/wave.jpg")
      const reveal = RevealTexture.fromLocation()
      expect(reveal).to.not.be.null
      expect(reveal?.isReady).to.be.false
      reveal?.dispose()
    } finally {
      globalThis.history.replaceState({}, "", originalSearch || "?")
    }
  })

  it("stays hidden and unready until the image loads", () => {
    const reveal = new RevealTexture()
    expect(reveal.texture).to.not.be.null
    expect(reveal.total).to.equal(32)
    expect(reveal.isReady).to.be.false
    expect(reveal.revealedCount).to.equal(0)
    expect(reveal.reveal(0.5)).to.equal(0)
    reveal.reset()
    expect(reveal.revealedCount).to.equal(0)
    reveal.dispose()
  })
})
