import { isTap } from "../../src/view/pointertap"

describe("PointerTap tap classifier", () => {
  const t0 = performance.now()
  const down = { clientX: 100, clientY: 100 }

  it("accepts a stationary quick press/release", () => {
    expect(
      isTap(down.clientX, down.clientY, t0, {
        ...down,
        button: 0,
        pointerType: "mouse",
      })
    ).toBe(true)
  })

  it("rejects movement beyond the slop", () => {
    expect(
      isTap(100, 100, t0, {
        clientX: 100 + 9,
        clientY: 100,
        button: 0,
        pointerType: "mouse",
      })
    ).toBe(false)
  })

  it("rejects a long press", () => {
    const early = t0 - 501
    expect(
      isTap(100, 100, early, {
        ...down,
        button: 0,
        pointerType: "mouse",
      })
    ).toBe(false)
  })

  it("rejects touch", () => {
    expect(
      isTap(100, 100, t0, {
        ...down,
        button: 0,
        pointerType: "touch",
      })
    ).toBe(false)
  })

  it("rejects non-primary buttons", () => {
    expect(
      isTap(100, 100, t0, {
        ...down,
        button: 2,
        pointerType: "mouse",
      })
    ).toBe(false)
  })
})
