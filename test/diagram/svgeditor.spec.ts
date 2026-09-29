import fs from "fs"
import path from "path"

// Stands in for svg.js, which the page imports as a module the test cannot
// load. renderBallPositions really draws, because the page then reads the
// circles back to move them.
const SVG_JS_STUB = `
const R = 0.03275;
const SVG_NS = "http://www.w3.org/2000/svg";
const X = 1.5;
const Y = 0.75;
function generateBilliardTable() {
  return { viewBox: "-1.7924 -1.0862 3.5848 2.1724", content: "" };
}
function renderBallPositions(group, state) {
  state.balls.forEach(({ id, pos }) => {
    const circle = document.createElementNS(SVG_NS, "circle");
    circle.setAttribute("class", "ball ball-" + id);
    circle.setAttribute("cx", String(pos.x));
    circle.setAttribute("cy", String(-pos.y));
    group.appendChild(circle);
  });
}
function setupSvgRoot(svg) {
  return {
    tableGroup: svg.querySelector(".table-group"),
    trajectoriesGroup: svg.querySelector(".trajectories-group"),
    ballsGroup: svg.querySelector(".balls-group"),
    statusEl: svg.querySelector(".worker-status"),
  };
}
function toSvgCoords(svg, event) {
  return { x: event.clientX || 0, y: event.clientY || 0 };
}
`

// The page's own markup, so a readout added to the widgets has to be added
// here too and the page is exercised as shipped.
const MARKUP = `
  <input id="power" type="range" />
  <svg class="billiards-table threecushion" viewBox="-1.7924 -1.0862 3.5848 2.1724">
    <g class="table-group"></g>
    <g class="trajectories-group"></g>
    <g class="balls-group"></g>
    <g class="inset-group"></g>
    <g class="manual-lines-group"></g>
    <g class="editing-group"></g>
    <text class="worker-status"></text>
  </svg>
  <svg class="spin-widget" viewBox="-1.05 -1.05 2.1 2.1">
    <circle class="spin-dot" />
    <text class="spin-readout"><tspan></tspan><tspan></tspan></text>
  </svg>
  <svg class="elevation-widget" viewBox="0 0 100 100">
    <path class="elevation-arc" />
    <line class="elevation-max" />
    <line class="elevation-line" />
    <text class="elevation-readout"></text>
  </svg>
  <div class="replaydiagram"><div class="topview"></div></div>
  <button id="open-constants" class="action-button" aria-expanded="false">constants</button>
  <button id="action" class="action-button" aria-expanded="false">action</button>
  <button id="open-presets" class="action-button" aria-expanded="false">presets</button>
  <button id="replay" type="button">replay</button>
  <button id="cleartraces" type="button">clear traces</button>
  <div class="modal-backdrop" id="constants-modal" hidden>
    <div class="modal" role="dialog">
      <div class="modal-panel">
        <fieldset class="model-toggle">
          <input type="radio" name="cushionModel" value="mathavan" checked />
          <input type="radio" name="cushionModel" value="stronge" />
        </fieldset>
        <div id="constants" class="constants">
          <div class="constant-group">
            <input type="checkbox" id="mathavan-toggle" class="collapse-toggle" />
            <div class="collapse-content">
              <input id="μs" type="range" />
              <div class="constant-row"><label for="μs"></label></div>
              <input id="μw" type="range" />
              <div class="constant-row"><label for="μw"></label></div>
              <input id="ee" type="range" />
              <div class="constant-row"><label for="ee"></label></div>
            </div>
          </div>
          <div class="constant-group">
            <input type="checkbox" id="han-toggle" class="collapse-toggle" />
            <div class="collapse-content">
              <input id="mu" type="range" />
              <div class="constant-row"><label for="mu"></label></div>
              <input id="muS" type="range" />
              <div class="constant-row"><label for="muS"></label></div>
            </div>
          </div>
          <div class="constant-group">
            <input type="checkbox" id="stronge-toggle" class="collapse-toggle" />
            <div class="collapse-content">
              <input id="stronge_omega_ratio" type="range" />
              <div class="constant-row"><label for="stronge_omega_ratio"></label></div>
              <input id="stronge_e_n" type="range" />
              <div class="constant-row"><label for="stronge_e_n"></label></div>
              <input id="stronge_μ" type="range" />
              <div class="constant-row"><label for="stronge_μ"></label></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="modal-backdrop" id="action-modal" hidden>
    <div class="modal" role="dialog">
      <div class="modal-panel">
        <div class="action-list">
          <button id="play" class="action-button" type="button">play in game</button>
          <button id="solution" class="action-button" type="button">computer search solutions</button>
          <button id="svg" class="action-button" type="button">svg diagram</button>
        </div>
      </div>
    </div>
  </div>
  <div class="modal-backdrop" id="presets-modal" hidden>
    <div class="modal" role="dialog">
      <div class="modal-panel">
        <div id="presets-list" class="presets-list"></div>
        <p id="presets-empty" class="presets-empty">No presets yet.</p>
        <div class="action-list">
          <button id="add-preset" class="action-button" type="button">save this shot</button>
          <button id="share-presets" class="action-button" type="button">share presets</button>
          <button id="reset-presets" class="action-button destructive" type="button">reset presets</button>
        </div>
      </div>
    </div>
  </div>
`

// jsdom has no layout, so every widget reports the same 200px square and the
// page's own screen-to-user conversions do the arithmetic.
const WIDGET_RECT = { left: 0, top: 0, width: 200, height: 200 } as DOMRect

function stubWidget(widget: SVGSVGElement) {
  widget.getBoundingClientRect = () => WIDGET_RECT
  widget.setPointerCapture = jest.fn()
  widget.releasePointerCapture = jest.fn()
  widget.hasPointerCapture = jest.fn().mockReturnValue(true)
  return widget
}

// editor-state.js is plain ESM, so the spec inlines it instead of importing it:
// dropping the export keywords leaves the names the page imports in scope.
function editorStateSource() {
  return fs
    .readFileSync(
      path.resolve(__dirname, "../../dist/diagrams/editor-state.js"),
      "utf-8"
    )
    .replace(/^export /gm, "")
}

// Loads the page's module script with its svg.js import swapped for a stub and
// its editor-state.js import inlined.
function loadEditor() {
  const html = fs.readFileSync(
    path.resolve(__dirname, "../../dist/diagrams/svgeditor.html"),
    "utf-8"
  )
  const match = html.match(/<script type="module">([\s\S]*?)<\/script>/)
  expect(match).not.toBeNull()
  const code = match![1]
    .replace(/import\s+\{[\s\S]*?\}\s+from\s+["']\.\/svg\.js["']/, SVG_JS_STUB)
    .replace(
      /import\s+\{[\s\S]*?\}\s+from\s+["']\.\/editor-state\.js["']/,
      editorStateSource()
    )
  Function(code)()
}

// The status line under the table, which now carries the aim and the power.
function statusText() {
  return document.querySelector(".worker-status")!.textContent
}

function fire(
  widget: SVGSVGElement,
  type: string,
  pointerId: number,
  clientX: number,
  clientY: number
) {
  const event = new Event(type, { bubbles: true })
  Object.assign(event, { pointerId, clientX, clientY })
  widget.dispatchEvent(event)
}

function press(widget: SVGSVGElement, clientX: number, clientY: number) {
  fire(widget, "pointerdown", 1, clientX, clientY)
  fire(widget, "pointerup", 1, clientX, clientY)
}

describe("svgeditor shot input", () => {
  afterEach(() => {
    document.body.innerHTML = ""
  })

  it("zooms in and out with multi-touch pinch gestures", () => {
    document.body.innerHTML = MARKUP
    loadEditor()

    const svg = stubWidget(
      document.querySelector("svg.billiards-table") as SVGSVGElement
    )
    // The table maps the pointer through a screen CTM that jsdom cannot give.
    svg.getScreenCTM = () =>
      ({
        a: 100,
        b: 0,
        c: 0,
        d: -100,
        e: 200,
        f: 200,
        inverse() {
          return this
        },
      }) as any

    const full = svg.getAttribute("viewBox")

    // Two fingers 100px apart, then one slides to make the gap 200: 2x zoom.
    // Both stay down, since the pinch is a two-pointer gesture.
    fire(svg, "pointerdown", 1, 100, 100)
    fire(svg, "pointerdown", 2, 200, 100)
    fire(svg, "pointermove", 2, 300, 100)

    // The controls panel is gone, so the viewBox itself is the readout: half
    // the width is a 2x zoom.
    expect(svg.getAttribute("viewBox")).not.toBe(full)
    expect(Number(svg.getAttribute("viewBox")!.split(" ")[2])).toBeCloseTo(
      Number(full!.split(" ")[2]) / 2
    )
    expect(svg.classList.contains("zoomed")).toBe(true)

    // Back to a 100px gap, so the full table again.
    fire(svg, "pointermove", 2, 200, 100)

    expect(svg.getAttribute("viewBox")).toBe(full)

    // The finger left over when the other lifts must not move the view.
    const held = svg.getAttribute("viewBox")
    fire(svg, "pointerup", 1, 100, 100)
    fire(svg, "pointermove", 2, 400, 400)
    expect(svg.getAttribute("viewBox")).toBe(held)
  })

  it("reads the spin offset and the elevation onto the widgets", () => {
    document.body.innerHTML = MARKUP
    loadEditor()

    const spinWidget = stubWidget(
      document.querySelector(".spin-widget") as unknown as SVGSVGElement
    )
    const elevationWidget = stubWidget(
      document.querySelector(".elevation-widget") as unknown as SVGSVGElement
    )
    const spinReadout = spinWidget.querySelector(".spin-readout")!
    const spinLines = () =>
      [...spinReadout.querySelectorAll("tspan")].map((t) => t.textContent)

    // The spin widget's viewBox is -1.05..1.05 over 200px, so a client point
    // maps to half of itself, and the dot is drawn mirrored in x. The two
    // lines are separate tspans, so textContent would run them together.
    press(spinWidget, 100, 100)
    expect(spinLines()).toEqual(["x +0.00", "y +0.00"])

    press(spinWidget, 145, 100)
    expect(spinLines()).toEqual(["x -0.45", "y +0.00"])

    // The elevation widget's is 0..100 over 200px, and the bearing is measured
    // from the pivot at (12, 88) up to the pointer, so (51.4, 59.4) is
    // atan2(28.6, 39.4) = 36 degrees. The widget shows it to a tenth.
    press(elevationWidget, 102.8, 118.8)
    expect(
      elevationWidget.querySelector(".elevation-readout")!.textContent
    ).toBe("36.0°")
  })

  it("notes the aim and the power on the status line under the table", () => {
    document.body.innerHTML = MARKUP
    loadEditor()

    // The status line is the table's own worker-status text, and it is the
    // only readout left now the controls panel is gone.
    expect(statusText()).toBe(
      "drag balls, scroll or pinch to zoom · 36.5 deg, 2.62 m/s"
    )

    const powerInput = document.getElementById("power") as HTMLInputElement
    // The slider is a fraction of MAX_POWER = 160R, so half is 2.62 m/s.
    powerInput.value = "0.25"
    powerInput.dispatchEvent(new Event("input", { bubbles: true }))
    expect(statusText()).toBe(
      "drag balls, scroll or pinch to zoom · 36.5 deg, 1.31 m/s"
    )

    // The panels and their buttons are gone entirely, resets included.
    expect(document.querySelector(".panel-side")).toBeNull()
    expect(document.getElementById("reset-view")).toBeNull()
    expect(document.getElementById("reset-spin")).toBeNull()
  })

  it("opens and closes the constants dialog from the action panel", () => {
    document.body.innerHTML = MARKUP
    loadEditor()

    const constantsButton = document.getElementById("open-constants")!
    const constantsModal = document.getElementById("constants-modal")!

    // The dialog ships closed, and the button says so for assistive tech.
    expect(constantsModal.hidden).toBe(true)
    expect(constantsButton.getAttribute("aria-expanded")).toBe("false")

    constantsButton.dispatchEvent(new Event("click", { bubbles: true }))
    expect(constantsModal.hidden).toBe(false)
    expect(constantsButton.getAttribute("aria-expanded")).toBe("true")

    // The dialog holds the constant sliders, each found by the diagram bundle
    // under its own name, so an input missing here is a slider that never binds.
    ;[
      "μs",
      "μw",
      "ee",
      "mu",
      "muS",
      "stronge_omega_ratio",
      "stronge_e_n",
      "stronge_μ",
    ].forEach((id) =>
      expect(constantsModal.querySelector(`input#${id}`)).not.toBeNull()
    )

    // Escape closes it, from the document rather than the dialog.
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }))
    expect(constantsModal.hidden).toBe(true)
    expect(constantsButton.getAttribute("aria-expanded")).toBe("false")

    // A click on the backdrop closes it too; a click inside it does not.
    constantsButton.dispatchEvent(new Event("click", { bubbles: true }))
    constantsModal
      .querySelector(".constant-row")!
      .dispatchEvent(new Event("click", { bubbles: true }))
    expect(constantsModal.hidden).toBe(false)

    constantsModal.dispatchEvent(new Event("click", { bubbles: true }))
    expect(constantsModal.hidden).toBe(true)
  })

  it("feeds the 3D replay the shot it is reading", () => {
    jest.useFakeTimers()
    try {
      document.body.innerHTML = MARKUP
      loadEditor()

      const topview = document.querySelector(".topview") as HTMLElement
      const replay = document.getElementById("replay") as HTMLButtonElement
      const click = jest.spyOn(replay, "click")
      // The state the diagram bundle reads back off the .topview.
      const replayed = () =>
        JSON.parse(
          new URLSearchParams(topview.dataset.state!.slice(1)).get("state")!
        )

      // The opening shot arrives in three.html's own data-state shape.
      expect(replayed().init).toEqual([
        -1.305026, -0.634005, -1.434758, 0.601475, -1.310215, 0.685593,
      ])
      expect(replayed().shots[0].angle).toBeCloseTo(0.63687)
      expect(replayed().shots[0].type).toBe("AIM")
      // Without this the replay starts on the aim view instead of the top.
      expect(replayed().diagram).toBe(true)

      // A control change is written through at once, but the replay button is
      // only pressed once the input goes quiet: it is ignored mid-shot anyway.
      const powerInput = document.getElementById("power") as HTMLInputElement
      powerInput.value = "0.25"
      powerInput.dispatchEvent(new Event("input", { bubbles: true }))
      expect(replayed().shots[0].power).toBeCloseTo(1.31)
      expect(click).not.toHaveBeenCalled()

      jest.advanceTimersByTime(300)
      expect(click).toHaveBeenCalled()
    } finally {
      jest.useRealTimers()
    }
  })

  it("keeps a moved constant in the url and replays the shot", () => {
    jest.useFakeTimers()
    try {
      document.body.innerHTML = MARKUP
      loadEditor()

      const replay = document.getElementById("replay") as HTMLButtonElement
      const click = jest.spyOn(replay, "click")
      // The bundle owns the slider's own value; it seeds from the url, so that
      // is where a moved constant has to be recorded.
      const mu = document.getElementById("mu") as HTMLInputElement
      mu.value = "0.006"
      mu.dispatchEvent(new Event("input", { bubbles: true }))

      expect(new URLSearchParams(window.location.search).get("mu")).toBe(
        "0.006"
      )
      expect(click).not.toHaveBeenCalled()

      jest.advanceTimersByTime(300)
      expect(click).toHaveBeenCalled()
    } finally {
      jest.useRealTimers()
    }
  })

  it("switches the cushion model the replay is played on", () => {
    jest.useFakeTimers()
    try {
      document.body.innerHTML = MARKUP
      loadEditor()

      const topview = document.querySelector(".topview") as HTMLElement
      const stronge = document.querySelector(
        'input[name="cushionModel"][value="stronge"]'
      ) as HTMLInputElement
      const replay = document.getElementById("replay") as HTMLButtonElement
      const click = jest.spyOn(replay, "click")
      const replayed = () =>
        new URLSearchParams(topview.dataset.state!.slice(1))

      // Mathavan is the default, so it is left out of the state entirely.
      expect(replayed().get("cushionModel")).toBeNull()

      stronge.checked = true
      stronge.dispatchEvent(new Event("change", { bubbles: true }))

      // It rides in the state, so the replay and any share link both follow.
      expect(replayed().get("cushionModel")).toBe("stronge")
      expect(
        new URLSearchParams(window.location.search).get("cushionModel")
      ).toBe("stronge")

      jest.advanceTimersByTime(300)
      expect(click).toHaveBeenCalled()

      // The constants are left to the sliders: whatever mu was stays as it was.
      const mu = new URLSearchParams(window.location.search).get("mu")
      const mathavan = document.querySelector(
        'input[value="mathavan"]'
      ) as HTMLInputElement
      mathavan.checked = true
      mathavan.dispatchEvent(new Event("change", { bubbles: true }))
      expect(new URLSearchParams(window.location.search).get("mu")).toBe(mu)
      // Back to the default, so it drops out of the URL as well.
      expect(replayed().get("cushionModel")).toBeNull()
    } finally {
      jest.useRealTimers()
    }
  })
})

describe("svgeditor dialogs and launch links", () => {
  // jsdom has no window.open, so the launch links are captured rather than
  // followed: the url each button builds is the whole of what it is for.
  let opened: string[]

  function load() {
    document.body.innerHTML = MARKUP
    opened = []
    window.open = ((url: string) => {
      opened.push(url)
      return null
    }) as typeof window.open
    loadEditor()
  }

  const byId = (id: string) => document.getElementById(id)!
  const click = (id: string) =>
    byId(id).dispatchEvent(new Event("click", { bubbles: true }))
  const params = (url: string) => new URL(url).searchParams

  afterEach(() => {
    document.body.innerHTML = ""
    // The page writes its own state back into the query string -- the cushion
    // model, the constants -- so a test that touches either leaves a url that
    // readState() then reads at the start of the next one. Without this a
    // preset applied in one test silently becomes the default in the next.
    window.history.replaceState(null, "", "/")
    localStorage.clear()
  })

  it("opens each button's own dialog, and no other", () => {
    load()
    const constants = byId("constants-modal")
    const actions = byId("action-modal")

    // Two dialogs, both shipped closed. There is no section to be left on.
    expect(constants.hidden).toBe(true)
    expect(actions.hidden).toBe(true)

    click("open-constants")
    expect(constants.hidden).toBe(false)
    expect(actions.hidden).toBe(true)
    expect(byId("open-constants").getAttribute("aria-expanded")).toBe("true")
    expect(byId("action").getAttribute("aria-expanded")).toBe("false")

    click("action")
    expect(actions.hidden).toBe(false)
    expect(byId("action").getAttribute("aria-expanded")).toBe("true")

    // Escape closes, from the document rather than from the dialog.
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }))
    expect(actions.hidden).toBe(true)
    expect(constants.hidden).toBe(true)
    expect(byId("open-constants").getAttribute("aria-expanded")).toBe("false")
    expect(byId("action").getAttribute("aria-expanded")).toBe("false")
  })

  it("opens one dialog at a time: the second closes the first", () => {
    load()
    const constants = byId("constants-modal")
    const actions = byId("action-modal")

    // Two backdrops stacked over the same panel is the state to rule out: with
    // both up, the one underneath is unreachable and pressing its button looks
    // like it did nothing.
    click("open-constants")
    expect([constants.hidden, actions.hidden]).toEqual([false, true])

    click("action")
    expect([constants.hidden, actions.hidden]).toEqual([true, false])
    expect(byId("open-constants").getAttribute("aria-expanded")).toBe("false")
    expect(byId("action").getAttribute("aria-expanded")).toBe("true")

    // And back the other way, so the rule is not just about document order.
    click("open-constants")
    expect([constants.hidden, actions.hidden]).toEqual([false, true])
  })

  it("puts a dialog away when its own button is pressed again", () => {
    load()
    const actions = byId("action-modal")

    click("action")
    expect(actions.hidden).toBe(false)
    click("action")
    expect(actions.hidden).toBe(true)
    expect(byId("action").getAttribute("aria-expanded")).toBe("false")

    click("open-constants")
    click("open-constants")
    expect(byId("constants-modal").hidden).toBe(true)
  })

  it("holds the launch links in the actions dialog, not the constants one", () => {
    load()
    // The two dialogs are separate elements rather than two sections of one, so
    // each holds only its own: a button landing in the wrong one is a link the
    // user has to go looking for.
    ;["play", "solution", "svg"].forEach((id) => {
      expect(byId("action-modal").querySelector(`#${id}`)).not.toBeNull()
      expect(byId("constants-modal").querySelector(`#${id}`)).toBeNull()
    })
    // And the sliders and the model toggle stay in the constants one.
    expect(
      byId("constants-modal").querySelector(".model-toggle")
    ).not.toBeNull()
    expect(byId("action-modal").querySelector(".model-toggle")).toBeNull()
  })

  it("keeps the panel's id for the bundle and off the button", () => {
    load()
    // The diagram bundle's Sliders finds the constants panel by this id, so a
    // button borrowing it would be found first in document order and leave the
    // sliders without a panel.
    const panels = document.querySelectorAll("#constants")
    expect(panels).toHaveLength(1)
    expect(byId("constants").tagName).toBe("DIV")
  })

  it("carries the ids the diagram bundle binds by itself", () => {
    load()
    // DiagramContainer.onAssetsReady looks two of these up with getButton and
    // wires them: "replay" for the re-run and "cleartraces" for the trails a
    // replay leaves behind. A renamed or missing one is a button that renders,
    // sits there and silently does nothing, so the ids are pinned here.
    expect(byId("replay")).not.toBeNull()
    expect(byId("cleartraces")).not.toBeNull()
    expect(byId("cleartraces").textContent).toBe("clear traces")
    // The other three open the dialogs, which the page's own script binds.
    expect(byId("open-constants")).not.toBeNull()
    expect(byId("action")).not.toBeNull()
    expect(byId("open-presets")).not.toBeNull()
  })

  describe("presets", () => {
    // The editor's own storage key, not three.html's, so the two lists stay
    // separate: a preset here carries elevation and the cushion model, which
    // three.html's shape has nowhere to put.
    const KEY = "svgeditor_presets"

    const stored = () => JSON.parse(localStorage.getItem(KEY)!)

    // A preset applied back has to move the whole page, not just the replay, so
    // the assertions read the state the replay is actually fed.
    const live = () => {
      const params = new URLSearchParams(
        document.querySelector(".topview")!.getAttribute("data-state")!.slice(1)
      )
      return {
        params,
        state: JSON.parse(params.get("state")!),
      }
    }

    beforeEach(() => {
      localStorage.clear()
    })

    // An explicitly emptied list, as distinct from never having saved one:
    // without this the built-in library is the starting point and every count
    // below is out by 36.
    const startEmpty = () => localStorage.setItem(KEY, "[]")

    it("starts new users with three.html's own library", () => {
      load()
      // A first visit has to have something to load, or the library is only
      // ever what the user already had in three.html. The count is pinned
      // rather than read from the module, which is function-scoped inside the
      // page script: regenerating the library should show up in review.
      const names = [...document.querySelectorAll(".preset-name")].map(
        (n) => n.textContent
      )
      expect(names).toHaveLength(36)
      expect(names).toContain("0->3 plain")
      expect(names).toContain("crosstable-vid")
      // Sorted for display, and nothing claims to be an empty list.
      expect([...names].sort((a, b) => a.localeCompare(b))).toEqual(names)
      expect(byId("presets-empty").hidden).toBe(true)
    })

    it("gives up the library only once the user has deleted it", () => {
      // Saving an empty list is not the same as never having saved one: the
      // built-ins come back on every load until the user removes them.
      localStorage.setItem(KEY, "[]")
      load()
      expect(document.querySelectorAll(".preset-row")).toHaveLength(0)
      expect(byId("presets-empty").hidden).toBe(false)
    })

    it("saves the shot it is on, and nothing about the constants", () => {
      startEmpty()
      load()
      window.prompt = () => "my shot"
      click("add-preset")

      expect(stored()).toHaveLength(1)
      const [preset] = stored()
      expect(preset.name).toBe("my shot")
      expect(preset.state.balls).toEqual([
        { x: -1.305026, y: -0.634005 },
        { x: -1.434758, y: 0.601475 },
        { x: -1.310215, y: 0.685593 },
      ])
      expect(preset.state.shot.angle).toBeCloseTo(0.63687, 5)
      // Applying a preset must never move a slider the user did not set.
      expect(preset.state).not.toHaveProperty("constants")
      expect(JSON.stringify(preset)).not.toContain("μs")
    })

    it("applies a saved shot back to the whole page", () => {
      // A preset that differs from the default in every field, including the
      // two three.html's own preset shape cannot carry. Seeded before the
      // editor runs, so this also covers the list being read on load.
      localStorage.setItem(
        KEY,
        JSON.stringify([
          {
            name: "loaded",
            state: {
              ruleType: "threecushion",
              cushionModel: "stronge",
              practice: false,
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
            },
          },
        ])
      )
      load()

      click("open-presets")
      expect(byId("presets-empty").hidden).toBe(true)
      document.querySelector<HTMLElement>(".preset-name")!.click()

      const { params, state } = live()
      expect(state.init).toEqual([0.5, 0.2, -0.9, -0.4, 1.1, 0.6])
      expect(state.shots[0].angle).toBeCloseTo(1.2)
      expect(state.shots[0].power).toBeCloseTo(3.5)
      expect(state.shots[0].offset.x).toBeCloseTo(-0.3)
      // The elevation and the model came back with it.
      expect(state.shots[0].elevation).toBeCloseTo(0.5)
      expect(params.get("cushionModel")).toBe("stronge")
      // The toggle follows the model even though the pointer never touched it.
      expect(
        (
          document.querySelector(
            'input[name="cushionModel"][value="stronge"]'
          ) as HTMLInputElement
        ).checked
      ).toBe(true)
      // And the dialog put itself away.
      expect(byId("presets-modal").hidden).toBe(true)
    })

    it("deletes a preset behind a confirmation", () => {
      startEmpty()
      load()
      window.prompt = () => "doomed"
      click("add-preset")
      expect(stored()).toHaveLength(1)

      let asked = ""
      window.confirm = (message?: string) => {
        asked = message ?? ""
        return false
      }
      document.querySelector<HTMLElement>(".preset-delete")!.click()
      // Declined, so nothing is lost.
      expect(asked).toContain("doomed")
      expect(stored()).toHaveLength(1)

      window.confirm = () => true
      document.querySelector<HTMLElement>(".preset-delete")!.click()
      expect(stored()).toHaveLength(0)
      // The empty message comes back with the empty list.
      expect(byId("presets-empty").hidden).toBe(false)
    })

    it("resets a saved list back to the built-in one", () => {
      // The way back from a list the user has made worse, without opening dev
      // tools and without deleting 36 rows one at a time.
      load()
      window.prompt = () => "mine"
      click("open-presets")
      click("add-preset")
      click("add-preset")
      expect(stored()).toHaveLength(38)

      // Declined, so nothing is lost.
      let asked = ""
      window.confirm = (message?: string) => {
        asked = message ?? ""
        return false
      }
      click("reset-presets")
      expect(asked).toContain("2 saved presets")
      expect(stored()).toHaveLength(38)

      window.confirm = () => true
      click("reset-presets")
      // Back to the library, in the list and in storage: an emptied key is
      // what the built-ins are the fallback for.
      expect(document.querySelectorAll(".preset-row")).toHaveLength(36)
      expect(localStorage.getItem(KEY)).toBeNull()
      expect(byId("presets-empty").hidden).toBe(true)
    })

    it("does not count the built-in library against the user on a reset", () => {
      // Asking someone to confirm throwing away 36 presets they never saved
      // would be a lie, so the count is only what they actually added.
      load()
      let asked = ""
      window.confirm = (message?: string) => {
        asked = message ?? ""
        return true
      }
      click("open-presets")
      click("reset-presets")
      expect(asked).toContain("restores the built-in set")
      expect(asked).not.toContain("36")
    })

    it("copies the list as a ps parameter and says so", async () => {
      jest.useFakeTimers()
      try {
        startEmpty()
        load()
        window.prompt = () => "shared"
        click("add-preset")

        // The share sheet where the platform has one, the clipboard where it
        // does not -- jsdom has neither share nor clipboard by default, so the
        // clipboard is the branch under test.
        const writeText = jest.fn().mockResolvedValue(undefined)
        Object.defineProperty(navigator, "clipboard", {
          value: { writeText },
          configurable: true,
        })
        const reported = jest
          .spyOn(console, "error")
          .mockImplementation(() => {})

        click("open-presets")
        click("share-presets")
        await Promise.resolve()

        expect(writeText).toHaveBeenCalledTimes(1)
        const href = writeText.mock.calls[0][0] as string
        // Opening this url would run the import, so it is handed over and not
        // navigated to: a new tab is exactly what this must not do.
        expect(opened).toHaveLength(0)
        // What is shared is the list, and nothing else the url was carrying.
        const url = new URL(href)
        expect(url.searchParams.get("ps")).toBe(JSON.stringify(stored()))
        expect(url.searchParams.get("state")).toBeNull()
        expect(url.searchParams.get("mu")).toBeNull()

        // Confirmed on the button, then put back so it does not lie later.
        await Promise.resolve()
        expect(byId("share-presets").textContent).toBe("copied!")
        jest.advanceTimersByTime(2000)
        expect(byId("share-presets").textContent).toBe("share presets")
        reported.mockRestore()
      } finally {
        jest.useRealTimers()
      }
    })
  })

  it("opens the live game on this shot with the constants it is holding", () => {
    load()

    // A constant the editor exposes, moved off its default. The link has to
    // carry what is on screen rather than what is in the url.
    const mu = byId("mu") as HTMLInputElement
    mu.value = "0.006"

    click("play")
    const url = new URL(opened[0])
    expect(url.pathname).toMatch(/index\.html$/)
    expect(url.searchParams.get("ruletype")).toBe("threecushion")
    expect(url.searchParams.get("practice")).toBe("true")
    expect(url.searchParams.get("cushionModel")).toBe("mathavan")
    expect(url.searchParams.get("mu")).toBe("0.006")
    expect(url.searchParams.get("μs")).not.toBeNull()

    // The balls travel as the flat [x, y, ...] list the live game reads.
    expect(JSON.parse(url.searchParams.get("init")!)).toEqual([
      -1.305026, -0.634005, -1.434758, 0.601475, -1.310215, 0.685593,
    ])

    const shot = JSON.parse(url.searchParams.get("initShot")!)
    expect(shot.cueBallId).toBe(0)
    expect(shot.angle).toBeCloseTo(0.63687, 5)
    expect(shot.power).toBeCloseTo(2.62, 2)
    expect(shot.elevation).toBe(0)
  })

  it("carries the elevation the editor is showing, unlike three.html's play", () => {
    load()
    const widget = stubWidget(
      document.querySelector(".elevation-widget") as unknown as SVGSVGElement
    )
    // The bearing is measured from the pivot at (12, 88) up to the pointer, so
    // this is atan2(28.6, 39.4) = 36 degrees.
    press(widget, 102.8, 118.8)

    click("play")
    const shot = JSON.parse(params(opened[0]).get("initShot")!)
    expect(shot.elevation).toBeCloseTo((36 * Math.PI) / 180, 2)
  })

  it("sends the layout and the constants, and no shot, to the fitter", () => {
    load()
    const mu = byId("mu") as HTMLInputElement
    mu.value = "0.006"

    click("solution")
    const url = new URL(opened[0])
    expect(url.pathname).toMatch(/fit\/solution\.html$/)
    expect(url.searchParams.get("init")).not.toBeNull()
    expect(url.searchParams.get("mu")).toBe("0.006")
    // The fit pages solve for an aim rather than replaying one, so there is
    // deliberately no initShot here, as in three.html.
    expect(url.searchParams.get("initShot")).toBeNull()
  })

  it("draws the shot as a diagram", () => {
    load()
    click("svg")
    const url = new URL(opened[0])
    expect(url.pathname).toMatch(/export\.html$/)
    expect(url.searchParams.get("ruletype")).toBe("threecushion")
    expect(url.searchParams.get("cushionModel")).toBe("mathavan")
    expect(JSON.parse(url.searchParams.get("init")!)).toHaveLength(6)
    expect(JSON.parse(url.searchParams.get("initShot")!).angle).toBeCloseTo(
      0.63687,
      5
    )
  })

  it("carries the cushion model the toggle is on", () => {
    load()
    const stronge = document.querySelector(
      'input[name="cushionModel"][value="stronge"]'
    ) as HTMLInputElement
    stronge.checked = true
    stronge.dispatchEvent(new Event("change", { bubbles: true }))

    click("play")
    expect(params(opened[0]).get("cushionModel")).toBe("stronge")
  })
})
