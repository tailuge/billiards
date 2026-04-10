import { expect } from "chai"
import { Container } from "../../src/container/container"

describe("Collision Depth Enrichment", () => {
  let container: any
  let mockTable: any

  beforeEach(() => {
    const mockAssets = {
      sound: {
        processOutcomes: () => {},
      },
      table: {
        add: () => {},
        remove: () => {},
        traverse: () => {},
        dispatchEvent: () => {},
      },
      rules: {
        asset: () => "mock",
      },
    }
    const config = {
      element: document.createElement("div"),
      log: () => {},
      assets: mockAssets,
      ruletype: "nineball",
    }
    container = new Container(config as any)
    mockTable = container.table
  })

  it("should enrich the error message when Table.advance throws 'Depth exceeded'", () => {
    const originalAdvance = mockTable.advance
    mockTable.advance = () => {
      throw new Error("Depth exceeded resolving collisions")
    }

    try {
      container.advance(0.1)
      expect.fail("Should have thrown an enriched error")
    } catch (e: any) {
      expect(e.message).to.contain("Depth exceeded resolving collisions")
      expect(e.message).to.contain('"phase": "advance"')
      expect(e.message).to.contain('"stateAtStart":')
      expect(e.message).to.contain('"version":')
      expect(e.message).to.not.contain("undefined")
    } finally {
      mockTable.advance = originalAdvance
    }
  })

  it("should enrich any error thrown during advance", () => {
    const originalAdvance = mockTable.advance
    mockTable.advance = () => {
      throw new Error("Some other error")
    }

    try {
      container.advance(0.1)
      expect.fail("Should have thrown")
    } catch (e: any) {
      expect(e.message).to.contain("Some other error")
      expect(e.message).to.contain('"phase": "advance"')
      expect(e.message).to.contain('"stateAtStart":')
    } finally {
      mockTable.advance = originalAdvance
    }
  })
})
