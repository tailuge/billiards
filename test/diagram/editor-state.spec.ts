import {
  DEFAULT_STATE,
  PHYSICS_DEFAULTS,
  PHYSICS_KEYS,
  readConstants,
  readState,
  serializeState,
  toStateJson,
} from "../../dist/diagrams/editor-state.js"

const params = (query: string) => new URLSearchParams(query)

describe("editor state", () => {
  it("opens on the default shot", () => {
    const state = readState()
    expect(state).toEqual(DEFAULT_STATE)
    expect(state.balls).toHaveLength(3)
    expect(state.shot.angle).toBeCloseTo(0.63687)
  })

  it("reads a shared shot, and falls back when it cannot be read", () => {
    const shared = serializeState({
      ...DEFAULT_STATE,
      cushionModel: "stronge",
      balls: [
        { x: -1.4, y: -0.7 },
        { x: -1.48, y: 0.34 },
        { x: -1.48, y: 0.44 },
      ],
      shot: { ...DEFAULT_STATE.shot, angle: 1.2, power: 3.5 },
    })

    const state = readState(params(shared))
    expect(state.cushionModel).toBe("stronge")
    expect(state.balls[2].x).toBeCloseTo(-1.48)
    expect(state.shot.angle).toBeCloseTo(1.2)
    expect(state.shot.power).toBeCloseTo(3.5)

    // three.html writes ?s=<state> for a share link and carries no cushion
    // model with it, so the shot comes back and the model falls to the default.
    const stateParam = params(shared).get("state")!
    const viaShare = readState(params(`s=${encodeURIComponent(stateParam)}`))
    expect(viaShare.balls).toEqual(state.balls)
    expect(viaShare.shot).toEqual(state.shot)
    expect(viaShare.cushionModel).toBe("mathavan")

    // Broken JSON must not leave the editor without a shot.
    const broken = readState(params("state=not-json"))
    expect(broken).toEqual(DEFAULT_STATE)
  })

  it("serialises the shot the way the diagram reads it back", () => {
    const json = toStateJson({
      ...DEFAULT_STATE,
      shot: { ...DEFAULT_STATE.shot, i: 1, offset: { x: -0.2, y: 0.22 } },
    })

    expect(json.init).toHaveLength(6)
    expect(json.shots).toHaveLength(1)
    expect(json.shots[0].type).toBe("AIM")
    // The flag that keeps the replay in the top view, as three.html's state has.
    expect(json.diagram).toBe(true)
    // The cue ball is the shot's ball, and its position follows it.
    expect(json.shots[0].i).toBe(1)
    expect(json.shots[0].pos).toEqual({ x: -1.434758, y: 0.601475, z: 0 })
    // A flat cue carries no elevation, as three.html's own state does not.
    expect(json.shots[0].elevation).toBeUndefined()

    // Round trip: what goes out comes back unchanged.
    expect(readState(params(serializeState(DEFAULT_STATE)))).toEqual(
      DEFAULT_STATE
    )
  })

  it("carries the physics constants the launch links forward", () => {
    expect(PHYSICS_KEYS).toContain("mu")
    expect(PHYSICS_KEYS).toContain("stronge_μ")

    // An absent key is not a zero: Number(null) is, so the guard is the test.
    expect(readConstants().R).toBe(PHYSICS_DEFAULTS.R)
    expect(readConstants().mu).toBeCloseTo(0.0055)

    expect(readConstants(params("mu=0.006&muS=0.25")).mu).toBeCloseTo(0.006)
    expect(readConstants(params("mu=0.006&muS=0.25")).muS).toBeCloseTo(0.25)
    expect(readConstants(params("mu=nonsense")).mu).toBeCloseTo(0.0055)
  })
})
