import { expect } from "chai"
import { Ball } from "../../src/model/ball"
import { Table } from "../../src/model/table"
import { Vector3 } from "three"
import { zero } from "../../src/utils/three-utils"
import { Rack } from "../../src/utils/rack"
import { ShotStartUtils } from "../../src/utils/shotstart"

describe("ShotStartUtils", () => {
  beforeEach(function (done) {
    Ball.id = 0
    done()
  })

  it("capture(table) reads positions + cue aim", (done) => {
    const table = new Table(Rack.diamond())
    table.cue.aim.angle = 0.42
    table.cue.aim.power = 1.7
    table.cue.aim.offset.set(0.05, -0.08, 0)
    table.cue.aim.elevation = 0.3
    const expectedBalls = table.shortSerialise()
    const c = ShotStartUtils.capture(table)
    expect(c.balls).to.deep.equal(expectedBalls)
    expect(c.cueBallId).to.equal(0)
    expect(c.angle).to.equal(0.42)
    expect(c.power).to.equal(1.7)
    expect(c.offsetX).to.equal(0.05)
    expect(c.offsetY).to.equal(-0.08)
    expect(c.elevation).to.equal(0.3)
    done()
  })

  it("capture(table, meta) stores supplied metadata", (done) => {
    const a = new Ball(zero)
    const b = new Ball(new Vector3(1, 0, 0))
    const table = new Table([a, b])
    const c = ShotStartUtils.capture(table, {
      cueBallId: 1,
      angle: 1.1,
      power: 2.2,
      offsetX: 0.1,
      offsetY: 0.2,
      elevation: 0.3,
      rulename: "threecushion",
      cushionModelName: "stronge",
      tableSize: 12,
      dt: 0.001,
    })
    expect(c.cueBallId).to.equal(1)
    expect(c.rulename).to.equal("threecushion")
    expect(c.cushionModelName).to.equal("stronge")
    expect(c.tableSize).to.equal(12)
    expect(c.dt).to.equal(0.001)
    done()
  })

  it("buildRecreateUrl() encodes init + initShot params that round-trip", (done) => {
    const table = new Table(Rack.diamond())
    table.cue.aim.angle = 1.234
    table.cue.aim.power = 3.406
    table.cue.aim.offset.set(-0.1, 0.2, 0)
    table.cue.aim.elevation = 0.5
    const c = ShotStartUtils.capture(table)
    const url = ShotStartUtils.buildRecreateUrl(c)
    expect(url).to.not.equal("")
    const params = new URLSearchParams(url.split("?")[1])
    expect(JSON.parse(params.get("init")!)).to.deep.equal(c.balls)
    expect(JSON.parse(params.get("initShot")!)).to.deep.equal({
      cueBallId: 0,
      angle: 1.234,
      power: 3.406,
      offset: { x: -0.1, y: 0.2 },
      elevation: 0.5,
    })
    expect(params.get("practice")).to.equal("")
    done()
  })

  it("buildRecreateUrl() prefers snapshot meta over page URL params", (done) => {
    const table = new Table([new Ball(zero), new Ball(new Vector3(1, 0, 0))])
    const c = ShotStartUtils.capture(table, {
      cueBallId: 0,
      angle: 0,
      power: 1,
      rulename: "snooker",
      cushionModelName: "stronge",
      tableSize: 9,
    })
    const params = new URLSearchParams(
      ShotStartUtils.buildRecreateUrl(c).split("?")[1]
    )
    expect(params.get("ruletype")).to.equal("snooker")
    expect(params.get("cushionModel")).to.equal("stronge")
    expect(params.get("tableSize")).to.equal("9")
    done()
  })

  it("buildRecreateUrl() uses snapshot baseUrl", (done) => {
    const table = new Table([new Ball(zero)])
    const c = ShotStartUtils.capture(table, {
      cueBallId: 0,
      angle: 0,
      power: 1,
      rulename: "threecushion",
      baseUrl: "https://example.test/index.html",
    })
    const url = ShotStartUtils.buildRecreateUrl(c)
    expect(url.startsWith("https://example.test/index.html?")).to.be.true
    done()
  })

  it("buildRecreateUrl() omits tableSize when it is 10 (default)", (done) => {
    const table = new Table([new Ball(zero)])
    const c = ShotStartUtils.capture(table, {
      cueBallId: 0,
      angle: 0,
      power: 1,
    })
    const params = new URLSearchParams(
      ShotStartUtils.buildRecreateUrl(c).split("?")[1]
    )
    expect(params.has("tableSize")).to.be.false
    done()
  })

  it("buildRecreateUrl() returns empty string when conditions undefined", (done) => {
    expect(ShotStartUtils.buildRecreateUrl(undefined)).to.equal("")
    done()
  })

  it("reportDepthExceeded() logs without throwing (no conditions)", (done) => {
    const table = new Table([new Ball(zero)])
    const spy = jest.spyOn(console, "error").mockImplementation(() => {})
    try {
      expect(() =>
        ShotStartUtils.reportDepthExceeded(table, undefined)
      ).to.not.throw()
      expect(spy.mock.calls).to.not.be.empty
    } finally {
      spy.mockRestore()
    }
    done()
  })

  it("reportDepthExceeded() logs the recreation link when conditions exist", (done) => {
    const table = new Table(Rack.diamond())
    table.cue.aim.angle = 0.5
    table.cue.aim.power = 2
    const c = ShotStartUtils.capture(table)
    const spy = jest.spyOn(console, "error").mockImplementation(() => {})
    try {
      ShotStartUtils.reportDepthExceeded(table, c)
      expect(spy.mock.calls).to.not.be.empty
      const msg = spy.mock.calls[0][0] as string
      expect(msg).to.contain("Depth exceeded resolving collisions")
      expect(msg).to.contain("Recreation link")
      expect(msg).to.contain("initShot")
    } finally {
      spy.mockRestore()
    }
    done()
  })
})
