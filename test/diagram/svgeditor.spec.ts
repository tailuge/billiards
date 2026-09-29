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

// Loads the page's module script with its svg.js import swapped for a stub.
function loadEditor() {
  const html = fs.readFileSync(
    path.resolve(__dirname, "../../dist/diagrams/svgeditor.html"),
    "utf-8"
  )
  const match = html.match(/<script type="module">([\s\S]*?)<\/script>/)
  expect(match).not.toBeNull()
  const code = match![1].replace(
    /import\s+\{[\s\S]*?\}\s+from\s+["']\.\/svg\.js["']/,
    SVG_JS_STUB
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
})
