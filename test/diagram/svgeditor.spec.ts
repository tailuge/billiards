import fs from "fs"
import path from "path"

describe("svgeditor pinch to zoom", () => {
  afterEach(() => {
    document.body.innerHTML = ""
  })

  it("zooms in and out with multi-touch pinch gestures", () => {
    const htmlPath = path.resolve(__dirname, "../../dist/diagrams/svgeditor.html")
    const html = fs.readFileSync(htmlPath, "utf-8")

    document.body.innerHTML = `
      <div id="zoom-level">×1.0</div>
      <p id="aim-angle"></p>
      <code id="spin-offset"></code>
      <button id="reset-spin"></button>
      <code id="power-value"></code>
      <code id="elevation-value"></code>
      <button id="reset-view"></button>
      <input id="power" type="range" />
      <svg class="billiards-table threecushion" viewBox="-1.7924 -1.0862 3.5848 2.1724">
        <g class="table-group"></g>
        <g class="trajectories-group"></g>
        <g class="balls-group">
          <circle class="ball ball-0" cx="-1.305026" cy="0.634005" r="0.03275"></circle>
          <circle class="ball ball-1" cx="-1.434758" cy="-0.601475" r="0.03275"></circle>
          <circle class="ball ball-2" cx="-1.310215" cy="-0.685593" r="0.03275"></circle>
        </g>
        <g class="inset-group"></g>
        <g class="manual-lines-group"></g>
        <g class="editing-group"></g>
        <text class="worker-status"></text>
      </svg>
      <svg class="spin-widget" viewBox="-1.05 -1.05 2.1 2.1"><circle class="spin-dot" /></svg>
      <svg class="elevation-widget" viewBox="0 0 100 100">
        <path class="elevation-arc" />
        <line class="elevation-max" />
        <line class="elevation-line" />
      </svg>
    `

    const svg = document.querySelector("svg.billiards-table") as SVGSVGElement
    svg.createSVGPoint = () =>
      ({
        x: 0,
        y: 0,
        matrixTransform() {
          return { x: this.x, y: this.y }
        },
      }) as any
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

    svg.setPointerCapture = jest.fn()
    svg.releasePointerCapture = jest.fn()
    svg.hasPointerCapture = jest.fn().mockReturnValue(true)

    const scriptMatch = html.match(/<script type="module">([\s\S]*?)<\/script>/)
    expect(scriptMatch).not.toBeNull()

    let scriptCode = scriptMatch![1]
    scriptCode = scriptCode.replace(
      /import\s+\{[\s\S]*?\}\s+from\s+["']\.\/svg\.js["']/,
      `
      const R = 0.03275;
      const SVG_NS = "http://www.w3.org/2000/svg";
      const X = 1.5;
      const Y = 0.75;
      function generateBilliardTable() {
        return { viewBox: "-1.7924 -1.0862 3.5848 2.1724", content: "" };
      }
      function renderBallPositions() {}
      function setupSvgRoot(svg) {
        return {
          tableGroup: svg.querySelector(".table-group"),
          trajectoriesGroup: svg.querySelector(".trajectories-group"),
          ballsGroup: svg.querySelector(".balls-group"),
          statusEl: svg.querySelector(".worker-status") || document.createElement("text"),
        };
      }
      function toSvgCoords(svg, event) {
        return { x: event.clientX || 0, y: event.clientY || 0 };
      }
      `
    )

    Function(scriptCode)()

    const zoomLevel = document.getElementById("zoom-level")!
    expect(zoomLevel.textContent).toBe("×1.0")

    // Dispatch 1st pointerdown
    const p1Down = new Event("pointerdown", { bubbles: true })
    Object.assign(p1Down, { pointerId: 1, clientX: 100, clientY: 100 })
    svg.dispatchEvent(p1Down)

    // Dispatch 2nd pointerdown
    const p2Down = new Event("pointerdown", { bubbles: true })
    Object.assign(p2Down, { pointerId: 2, clientX: 200, clientY: 100 })
    svg.dispatchEvent(p2Down)

    // Distance was 100. Dispatch pointermove to clientX: 300 (distance = 200, 2x zoom)
    const p2Move = new Event("pointermove", { bubbles: true })
    Object.assign(p2Move, { pointerId: 2, clientX: 300, clientY: 100 })
    svg.dispatchEvent(p2Move)

    expect(zoomLevel.textContent).toBe("×2.0")
    expect(svg.classList.contains("zoomed")).toBe(true)

    // Pinch back in (distance = 100, half distance -> zoom x1.0)
    const p2MoveBack = new Event("pointermove", { bubbles: true })
    Object.assign(p2MoveBack, { pointerId: 2, clientX: 200, clientY: 100 })
    svg.dispatchEvent(p2MoveBack)

    expect(zoomLevel.textContent).toBe("×1.0")

    // Dispatch pointerup for both
    const p1Up = new Event("pointerup", { bubbles: true })
    Object.assign(p1Up, { pointerId: 1 })
    svg.dispatchEvent(p1Up)

    const p2Up = new Event("pointerup", { bubbles: true })
    Object.assign(p2Up, { pointerId: 2 })
    svg.dispatchEvent(p2Up)
  })
})
