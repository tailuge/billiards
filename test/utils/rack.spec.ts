import { TableGeometry } from "../../src/view/tablegeometry"
import { Rack } from "../../src/utils/rack"

describe("Rack dimensions and positioning", () => {
  beforeEach(() => {
    // Reset table dimensions to default pool/snooker (tableSize = 10)
    TableGeometry.configureForRule("snooker", 10)
  })

  afterEach(() => {
    // Restore default to not leak side-effects
    TableGeometry.configureForRule("snooker", 10)
  })

  it("should dynamically calculate spot, sixth, and baulk on table size configuration", () => {
    // Check default values at tableSize = 10
    const spot10 = Rack.spot.clone()
    const sixth10 = Rack.sixth
    const baulk10 = Rack.baulk

    expect(spot10.x).toBeCloseTo(-TableGeometry.X / 2, 5)
    expect(sixth10).toBeCloseTo((TableGeometry.Y * 2) / 6, 5)
    expect(baulk10).toBeCloseTo((-1.5 * TableGeometry.X * 2) / 5, 5)

    // Reconfigure for tableSize = 12
    TableGeometry.configureForRule("snooker", 12)

    const spot12 = Rack.spot.clone()
    const sixth12 = Rack.sixth
    const baulk12 = Rack.baulk

    expect(spot12.x).toBeCloseTo(-TableGeometry.X / 2, 5)
    expect(sixth12).toBeCloseTo((TableGeometry.Y * 2) / 6, 5)
    expect(baulk12).toBeCloseTo((-1.5 * TableGeometry.X * 2) / 5, 5)

    // Check that values actually changed on resize
    expect(spot12.x).not.toBeCloseTo(spot10.x, 5)
    expect(sixth12).not.toBeCloseTo(sixth10, 5)
    expect(baulk12).not.toBeCloseTo(baulk10, 5)
  })

  it("should position yellow, green, and brown on the correct baulk line for a scaled snooker table", () => {
    // Configure for tableSize = 12
    TableGeometry.configureForRule("snooker", 12)

    // Retrieve snooker racked balls
    // Note: Rack.snooker() returns balls where:
    // balls[0]: cue ball
    // balls[1..6]: colours (yellow, green, brown, blue, pink, black)
    // balls[1] = yellow (at baulk line, -sixth)
    // balls[2] = green (at baulk line, +sixth)
    // balls[3] = brown (at baulk line, 0)
    const balls = Rack.snooker()

    const yellow = balls[1]
    const green = balls[2]
    const brown = balls[3]

    // Expect yellow x, y to be on the scaled baulk line (with jitter offset)
    // Let's verify coordinates are close to Rack.baulk and -Rack.sixth (taking jitter into account)
    // Since Rack.jitter adds small random noise, we can verify that the underlying positions
    // before jitter (or within a tolerance matching the jitter) are exactly Rack.baulk and Rack.sixth.
    // The jitter in Rack is static readonly noise = Math.fround(R * 0.023 + 0.0015 * Math.random())
    // With R = 0.02625 (usually), jitter is less than 0.01. So 0.05 tolerance is perfectly safe.
    expect(yellow.pos.x).toBeCloseTo(Rack.baulk, 1)
    expect(yellow.pos.y).toBeCloseTo(-Rack.sixth, 1)

    expect(green.pos.x).toBeCloseTo(Rack.baulk, 1)
    expect(green.pos.y).toBeCloseTo(Rack.sixth, 1)

    expect(brown.pos.x).toBeCloseTo(Rack.baulk, 1)
    expect(brown.pos.y).toBeCloseTo(0, 1)
  })
})
