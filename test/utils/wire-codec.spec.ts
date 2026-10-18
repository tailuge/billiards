import { expect } from "chai"
import { Vector3 } from "three"
import {
  decodeCoords,
  encodeCoords,
  wireConfig,
} from "../../src/utils/wire-codec"
import { EventUtil } from "../../src/events/eventutil"
import { WatchEvent } from "../../src/events/watchevent"
import { Table } from "../../src/model/table"
import { Ball, State } from "../../src/model/ball"
import { Rack } from "../../src/utils/rack"
import { R } from "../../src/model/physics/constants"

describe("wire codec", () => {
  afterEach(() => {
    wireConfig.compactWatchBalls = true
  })

  it("round trips ball counts used by each rule type", () => {
    for (const n of [3, 4, 10, 16, 22]) {
      const coords = Array.from({ length: n * 2 }, (_, i) => i * 0.1 - 1.3)
      const decoded = decodeCoords(encodeCoords(coords))
      expect(decoded).to.deep.equal(coords)
    }
  })

  it("preserves exact float64 values including -0 and extremes", () => {
    const coords = [0, -0, 0.1, -1.7976931348623157e308, 5e-324, 1.23456789]
    const decoded = decodeCoords(encodeCoords(coords))
    expect(Object.is(decoded[1], -0)).to.be.true
    expect(decoded).to.deep.equal(coords)
  })

  it("rejects unknown version prefix", () => {
    expect(() => decodeCoords("2|AAAAAAAAAAAAAAAAAAAAAA")).to.throw(
      "unsupported wire version"
    )
  })

  it("rejects empty payload", () => {
    expect(() => decodeCoords("1|")).to.throw("bad coordinate blob length")
  })

  it("rejects misaligned byte length", () => {
    // 3 doubles = 24 bytes, not a multiple of 16
    expect(() => decodeCoords(encodeCoords([1, 2, 3]))).to.throw(
      "bad coordinate blob length"
    )
  })

  it("rejects invalid base64", () => {
    expect(() => decodeCoords("1|!!!!")).to.throw("bad base64 payload")
  })
})

describe("WATCHAIM packed event", () => {
  afterEach(() => {
    wireConfig.compactWatchBalls = true
  })

  it("sends balls as a string and restores x, y and id on receipt", () => {
    const table = new Table(Rack.diamond())
    const serialised = EventUtil.serialise(new WatchEvent(table.serialise()))
    expect(JSON.parse(serialised).json.balls).to.be.a("string")

    const received = EventUtil.fromSerialised(serialised) as WatchEvent
    expect(received.json.balls).to.have.length(table.balls.length)
    table.balls.forEach((b, i) => {
      expect(received.json.balls[i].id).to.equal(b.id)
      expect(received.json.balls[i].pos.x).to.equal(b.pos.x)
      expect(received.json.balls[i].pos.y).to.equal(b.pos.y)
      expect(received.json.balls[i].pos.z).to.be.undefined
    })
  })

  it("sends the verbose array when the toggle is off", () => {
    wireConfig.compactWatchBalls = false
    const table = new Table(Rack.diamond())
    const serialised = EventUtil.serialise(new WatchEvent(table.serialise()))
    expect(JSON.parse(serialised).json.balls).to.be.an("array")

    const received = EventUtil.fromSerialised(serialised) as WatchEvent
    expect(received.json.balls[0].pos.z).to.equal(table.balls[0].pos.z)
  })
})

describe("Ball.updateFromSerialised z rule", () => {
  it("keeps local z for a potted ball when the frame has no z", () => {
    const b = new Ball(new Vector3(0, 0, -5 * R))
    b.state = State.InPocket
    Ball.updateFromSerialised(b, { pos: { x: 1, y: 2 } })
    expect(b.pos.x).to.equal(1)
    expect(b.pos.y).to.equal(2)
    expect(b.pos.z).to.equal(-5 * R)
  })

  it("sets z to 0 for an on-table ball when the frame has no z", () => {
    const b = new Ball(new Vector3(0, 0, 0.5))
    Ball.updateFromSerialised(b, { pos: { x: 1, y: 2 } })
    expect(b.pos.z).to.equal(0)
  })

  it("uses z from the frame when present", () => {
    const b = new Ball(new Vector3(0, 0, 0))
    b.state = State.InPocket
    Ball.updateFromSerialised(b, { pos: { x: 1, y: 2, z: -3 * R } })
    expect(b.pos.z).to.equal(-3 * R)
  })
})
