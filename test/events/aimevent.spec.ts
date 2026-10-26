import { expect } from "chai"
import { Vector3 } from "three"
import { AimEvent } from "../../src/events/aimevent"
import { EventUtil } from "../../src/events/eventutil"
import { HitEvent } from "../../src/events/hitevent"
import { WatchEvent } from "../../src/events/watchevent"
import { Table } from "../../src/model/table"
import { Rack } from "../../src/utils/rack"

describe("AimEvent compact JSON", () => {
  it("omits a zero offset and writes pos as [x, y]", (done) => {
    const event = new AimEvent()
    event.pos = new Vector3(1.25, -0.5, 0)
    event.angle = 0.1
    event.power = 3

    const json = JSON.parse(EventUtil.serialise(event))

    expect(json.pos).to.deep.equal([1.25, -0.5])
    expect(json.offset).to.be.undefined
    expect(json.elevation).to.be.undefined
    expect(json.i).to.be.undefined

    const decoded = EventUtil.fromSerialised(JSON.stringify(json)) as AimEvent
    expect(decoded.pos.equals(new Vector3(1.25, -0.5, 0))).to.be.true
    expect(decoded.offset.equals(new Vector3(0, 0, 0))).to.be.true
    expect(decoded.angle).to.be.closeTo(0.1, 1e-9)
    expect(decoded.power).to.equal(3)
    done()
  })

  it("writes a non-zero offset as [x, y] without z", (done) => {
    const event = new AimEvent()
    event.pos = new Vector3(0, 0, 0)
    event.offset = new Vector3(0.1, -0.2, 0)

    const json = JSON.parse(EventUtil.serialise(event))

    expect(json.offset).to.deep.equal([0.1, -0.2])
    expect(json.offset).to.have.lengthOf(2)

    const decoded = AimEvent.fromJson(json)
    expect(decoded.offset.equals(new Vector3(0.1, -0.2, 0))).to.be.true
    done()
  })

  it("omits zero elevation and i, and round-trips non-zero values", (done) => {
    const lean = JSON.parse(EventUtil.serialise(new AimEvent()))
    expect(lean.elevation).to.be.undefined
    expect(lean.i).to.be.undefined

    const event = new AimEvent()
    event.elevation = 0.15
    event.i = 1
    const json = JSON.parse(EventUtil.serialise(event))
    expect(json.elevation).to.be.closeTo(0.15, 1e-9)
    expect(json.i).to.equal(1)

    const decoded = AimEvent.fromJson(json)
    expect(decoded.elevation).to.be.closeTo(0.15, 1e-9)
    expect(decoded.i).to.equal(1)
    done()
  })

  it("still decodes the old verbose payload", (done) => {
    const decoded = AimEvent.fromJson({
      type: "AIM",
      pos: { x: 1, y: 2, z: 0 },
      offset: { x: 0.3, y: 0.4, z: 0 },
      angle: 1.2,
      power: 5,
      elevation: 0.2,
      i: 1,
    })

    expect(decoded.pos.equals(new Vector3(1, 2, 0))).to.be.true
    expect(decoded.offset.equals(new Vector3(0.3, 0.4, 0))).to.be.true
    expect(decoded.angle).to.be.closeTo(1.2, 1e-9)
    expect(decoded.power).to.equal(5)
    expect(decoded.elevation).to.be.closeTo(0.2, 1e-9)
    expect(decoded.i).to.equal(1)
    done()
  })

  it("compacts the aim nested in a HIT and decodes it", (done) => {
    const table = new Table(Rack.diamond())
    table.cue.aim = AimEvent.fromJson({
      pos: [0, 0],
      offset: [0.1, -0.2],
      angle: 0.3,
      power: 4,
      elevation: 0.1,
      i: 1,
    })

    const parsed = JSON.parse(
      EventUtil.serialise(new HitEvent(table.serialiseHit()))
    )
    const aim = parsed.tablejson.aim

    expect(aim.pos).to.deep.equal([table.cueball.pos.x, table.cueball.pos.y])
    expect(aim.offset).to.deep.equal([0.1, -0.2])
    expect(aim.pos).to.have.lengthOf(2)

    const decoded = AimEvent.fromJson(aim)
    expect(decoded.offset.equals(new Vector3(0.1, -0.2, 0))).to.be.true
    expect(decoded.elevation).to.be.closeTo(0.1, 1e-9)
    expect(decoded.i).to.equal(1)
    done()
  })

  it("compacts the aim inside a WATCHAIM payload and decodes it", (done) => {
    const table = new Table(Rack.diamond())
    table.cue.aim = AimEvent.fromJson({
      pos: [0.5, -0.5],
      offset: [0.05, 0.1],
      angle: 0.2,
      power: 2,
      elevation: 0.1,
      i: 1,
    })

    const serialised = EventUtil.serialise(new WatchEvent(table.serialise()))
    const parsed = JSON.parse(serialised)
    expect(parsed.json.aim.pos).to.deep.equal([0.5, -0.5])
    expect(parsed.json.aim.offset).to.deep.equal([0.05, 0.1])

    const received = EventUtil.fromSerialised(serialised) as WatchEvent
    const decodedTable = Table.fromSerialised(received.json)
    expect(decodedTable.cue.aim.offset.equals(new Vector3(0.05, 0.1, 0))).to.be
      .true
    expect(decodedTable.cue.aim.elevation).to.be.closeTo(0.1, 1e-9)
    expect(decodedTable.cue.aim.i).to.equal(1)
    done()
  })

  it("copies a lean-decoded event without sharing vectors", (done) => {
    const decoded = AimEvent.fromJson({ pos: [1, 2], angle: 0.5, power: 1 })
    const copy = decoded.copy()

    copy.offset.set(5, 5, 0)
    copy.pos.set(9, 9, 0)

    expect(decoded.offset.equals(new Vector3(0, 0, 0))).to.be.true
    expect(decoded.pos.equals(new Vector3(1, 2, 0))).to.be.true
    done()
  })

  it("decodes a short array without NaN", (done) => {
    const short = AimEvent.fromJson({ pos: [3], angle: 0, power: 1 })
    expect(short.pos.x).to.equal(3)
    expect(short.pos.y).to.equal(0)
    expect(short.pos.z).to.equal(0)
    expect(Number.isNaN(short.pos.x)).to.be.false
    done()
  })

  it("keeps angle, power and pos exact in HIT and WATCHAIM", (done) => {
    const table = new Table(Rack.diamond())
    const angle = 0.14088277518749237
    const power = Math.fround(0.37 * 5.24)
    table.cue.aim = AimEvent.fromJson({
      pos: [-0.7566816210746765, -0.18933309614658356],
      angle,
      power,
    })
    table.cueball.pos.set(-0.7566816210746765, -0.18933309614658356, 0)

    const hit = JSON.parse(
      EventUtil.serialise(new HitEvent(table.serialiseHit()))
    )
    // delta 0: HIT and WATCHAIM must carry the source values untouched
    expect(hit.tablejson.aim.angle).to.be.closeTo(angle, 0)
    expect(hit.tablejson.aim.power).to.be.closeTo(power, 0)
    expect(hit.tablejson.aim.pos).to.deep.equal([
      table.cueball.pos.x,
      table.cueball.pos.y,
    ])

    const watch = JSON.parse(
      EventUtil.serialise(new WatchEvent(table.serialise()))
    )
    expect(watch.json.aim.angle).to.be.closeTo(angle, 0)
    expect(watch.json.aim.power).to.be.closeTo(power, 0)
    expect(watch.json.aim.pos).to.deep.equal([
      -0.7566816210746765, -0.18933309614658356,
    ])
    done()
  })

  it("never writes z for pos or offset", (done) => {
    const event = new AimEvent()
    event.pos = new Vector3(1, 2, 0)
    event.offset = new Vector3(0.5, 0.25, 0)
    const json = JSON.parse(EventUtil.serialise(event))
    expect(json.pos).to.have.lengthOf(2)
    expect(json.offset).to.have.lengthOf(2)
    expect(Object.keys(json)).not.to.include("z")

    const table = new Table(Rack.diamond())
    table.cue.aim = event
    const hit = JSON.parse(
      EventUtil.serialise(new HitEvent(table.serialiseHit()))
    )
    expect(hit.tablejson.aim.pos).to.have.lengthOf(2)
    expect(hit.tablejson.aim.offset).to.have.lengthOf(2)
    expect(Object.keys(hit.tablejson.aim)).not.to.include("z")
    done()
  })
})
