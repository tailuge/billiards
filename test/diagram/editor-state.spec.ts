import {
  DEFAULT_STATE,
  PHYSICS_DEFAULTS,
  PHYSICS_KEYS,
  readConstants,
  capturePreset,
  loadPresets,
  savePresets,
  clearPresets,
  PRESETS_KEY,
  MAX_PRESET_NAME,
  readState,
  serializeState,
  shareShotUrl,
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

  describe("share links", () => {
    const shotState = {
      ...DEFAULT_STATE,
      cushionModel: "stronge",
      balls: [
        { x: 0.5, y: 0.2 },
        { x: -0.9, y: -0.4 },
        { x: 1.1, y: 0.6 },
      ],
      shot: {
        angle: 1.234567,
        power: 3.5,
        offset: { x: -0.3, y: 0.25 },
        elevation: 0.5,
        i: 1,
      },
    }

    const href = "https://billiards.example/diagrams/three.html"

    it("carries the shot as the init params the launch links write", () => {
      const url = shareShotUrl(href, shotState)

      expect(url.searchParams.get("init")).toBe(
        JSON.stringify([0.5, 0.2, -0.9, -0.4, 1.1, 0.6])
      )
      const shot = JSON.parse(url.searchParams.get("initShot")!)
      expect(shot.cueBallId).toBe(1)
      expect(shot.angle).toBeCloseTo(1.234567, 6)
      expect(shot.power).toBeCloseTo(3.5, 6)
      expect(shot.offset).toEqual({ x: -0.3, y: 0.25, z: 0 })
      expect(shot.elevation).toBeCloseTo(0.5, 6)

      // It is a link back to this page, not a launch somewhere else.
      expect(url.href).toContain("/diagrams/three.html")
    })

    it("omits the defaults the reader is already running", () => {
      const url = shareShotUrl(href, DEFAULT_STATE, {
        μs: PHYSICS_DEFAULTS["μs"],
        mu: String(PHYSICS_DEFAULTS.mu),
      })

      // threecushion and mathavan are what the page opens on anyway.
      expect(url.searchParams.get("cushionModel")).toBeNull()
      expect(url.searchParams.get("ruletype")).toBeNull()
      // And a constant still sitting on its default says nothing the reader
      // does not already know, which is most of what a link would carry.
      expect(url.searchParams.get("μs")).toBeNull()
      expect(url.searchParams.get("mu")).toBeNull()
    })

    it("carries the cushion model and the constants that were moved", () => {
      const url = shareShotUrl(href, shotState, { mu: "0.006", μs: "0.25" })

      expect(url.searchParams.get("cushionModel")).toBe("stronge")
      expect(url.searchParams.get("mu")).toBe("0.006")
      expect(url.searchParams.get("μs")).toBe("0.25")
    })

    it("drops the query it was built from", () => {
      const url = shareShotUrl(`${href}?ps=[{"name":"x"}]`, DEFAULT_STATE)
      expect(url.searchParams.get("ps")).toBeNull()
      expect(url.searchParams.get("init")).not.toBeNull()
    })

    it("reopens the shot it wrote", () => {
      const url = shareShotUrl(href, shotState, { mu: "0.006" })
      // The link is only worth having if opening it puts the same shot on the
      // table, so this is a round trip rather than a look at the parameters.
      const state = readState(new URLSearchParams(url.search))

      expect(state.balls).toEqual(shotState.balls)
      expect(state.shot).toEqual(shotState.shot)
      expect(state.cushionModel).toBe("stronge")
    })

    it("reads the launch params, and the defaults where one is missing", () => {
      const state = readState(
        params(
          "init=[0.5,0.2,-0.9,-0.4]&initShot=" +
            encodeURIComponent(JSON.stringify({ cueBallId: 1, angle: 0.5 }))
        )
      )

      expect(state.balls).toEqual([
        { x: 0.5, y: 0.2 },
        { x: -0.9, y: -0.4 },
      ])
      expect(state.shot.angle).toBeCloseTo(0.5)
      // `cueBallId` is the launch links' name for the shot's `i`.
      expect(state.shot.i).toBe(1)
      expect(state.shot.power).toBe(DEFAULT_STATE.shot.power)
      expect(state.shot.elevation).toBe(0)

      // A broken pair, like a broken document, still opens on a shot rather
      // than none: a link someone pasted is not worth losing the page over.
      expect(readState(params("init=not-json&initShot=not-json"))).toEqual(
        DEFAULT_STATE
      )
    })
  })

  describe("presets", () => {
    const shotState = {
      ...DEFAULT_STATE,
      cushionModel: "stronge",
      balls: [
        { x: 0.5, y: 0.2 },
        { x: -0.9, y: -0.4 },
        { x: 1.1, y: 0.6 },
      ],
      shot: {
        angle: 1.2,
        power: 3.5,
        offset: { x: -0.3, y: 0.25 },
        elevation: 0.5,
        i: 0,
      },
    }

    beforeEach(() => {
      localStorage.clear()
    })

    it("captures the shot whole, including what three.html drops", () => {
      const preset = capturePreset(shotState, "loaded")
      expect(preset.name).toBe("loaded")
      expect(preset.state.balls).toEqual(shotState.balls)
      // Elevation and the cushion model are the two fields three.html's preset
      // shape has nowhere to put, and the reason for a separate list.
      expect(preset.state.shot.elevation).toBe(0.5)
      expect(preset.state.cushionModel).toBe("stronge")
    })

    it("captures no constants, so applying one moves no slider", () => {
      const preset = capturePreset(shotState, "loaded")
      expect(preset.state).not.toHaveProperty("constants")
      expect(Object.keys(preset.state).sort()).toEqual([
        "balls",
        "cushionModel",
        "practice",
        "ruleType",
        "shot",
      ])
    })

    it("caps the name", () => {
      expect(capturePreset(shotState, "x".repeat(40)).name).toHaveLength(
        MAX_PRESET_NAME
      )
    })

    it("round-trips through storage", () => {
      const preset = capturePreset(shotState, "one")
      expect(savePresets([preset])).toBe(true)
      expect(loadPresets()).toEqual([preset])
    })

    it("clears the saved list back to the built-in one", () => {
      savePresets([capturePreset(shotState, "one")])
      expect(clearPresets()).toBe(true)
      // An emptied key IS the built-in library, which is why clearing is the
      // whole of a reset and there is nothing to write back.
      expect(localStorage.getItem(PRESETS_KEY)).toBeNull()
      expect(loadPresets()).toHaveLength(36)
    })

    it("falls back to the built-in library, not to nothing", () => {
      // A first visit has to have something to load. The list is converted from
      // three.html's own defaults, so the two pages open on the same shots.
      expect(loadPresets()).toHaveLength(36)
      expect(loadPresets()[0].name).toBe("0->3 plain")
      // A copy, so a caller mutating what it got back cannot corrupt the
      // library every later visit starts from.
      loadPresets().push({ name: "scribble", state: {} })
      expect(loadPresets()).toHaveLength(36)
    })

    it("distinguishes an emptied list from one never saved", () => {
      // Deleting every preset is a decision, and it sticks; the built-ins are
      // the fallback for a first visit, not a floor under every visit.
      localStorage.setItem(PRESETS_KEY, "[]")
      expect(loadPresets()).toEqual([])
    })

    it("survives unreadable storage by falling back, not by throwing", () => {
      // loadPresets reports the bad entry and carries on, so the noise is part
      // of what is being asserted here.
      const reported = jest.spyOn(console, "error").mockImplementation(() => {})
      // Corrupt or the wrong shape costs the user their own presets and nothing
      // more -- not the page, and not the built-in library.
      localStorage.setItem(PRESETS_KEY, "{not json")
      expect(loadPresets()).toHaveLength(36)
      localStorage.setItem(PRESETS_KEY, '{"not":"a list"}')
      expect(loadPresets()).toHaveLength(36)
      expect(reported).toHaveBeenCalled()
      reported.mockRestore()
    })
  })
})
