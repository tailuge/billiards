import "mocha"
import { expect } from "chai"
import { View } from "../../src/view/view"
import { Table } from "../../src/model/table"
import { Rack } from "../../src/utils/rack"
import { initDom, canvas3d } from "./dom"

initDom()

describe("View", () => {
  const table = new Table(Rack.diamond())

  it("isInView", (done) => {
    table.hasPockets = true
    const view = new View(canvas3d, () => {}, table, true)
    view.table = table
    expect(view.isInMotionNotVisible()).to.be.false
    done()
  })

  it("without assets", (done) => {
    table.hasPockets = false
    const view = new View(canvas3d, () => {}, table, false)
    view.table = table
    expect(view.isInMotionNotVisible()).to.be.false
    done()
  })
})
