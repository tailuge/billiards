import "mocha"
import { expect } from "chai"
import { View } from "../../src/view/view"
import { Table } from "../../src/model/table"
import { Rack } from "../../src/utils/rack"

describe("View", () => {
  const table = new Table(Rack.diamond())
  const view = new View(null, () => {}, table)

  it("isInView", (done) => {
    view.table = table
    expect(view.isInMotionNotVisible()).to.be.false
    done()
  })
})
