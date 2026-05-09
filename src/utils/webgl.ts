import { WebGLRenderer, SRGBColorSpace, NoToneMapping } from "three"
import { Session } from "../network/client/session"

export function renderer(element: HTMLElement) {
  if (typeof process !== "undefined") {
    return undefined
  }

  const renderer = new WebGLRenderer({
    antialias: Session.getLod() > 2,
    depth: true,
    powerPreference: "high-performance",
    stencil: false,
    alpha: false,
  })

  renderer.shadowMap.enabled = false
  renderer.autoClear = false
  renderer.outputColorSpace = SRGBColorSpace
  renderer.toneMapping = NoToneMapping
  renderer.sortObjects = false
  renderer.setSize(element.offsetWidth, element.offsetHeight)
  renderer.setPixelRatio(computeCappedDPR())
  renderer.domElement.draggable = false
  renderer.domElement.style.userSelect = "none"
  renderer.domElement.addEventListener("dragstart", (e) => e.preventDefault())
  element.appendChild(renderer.domElement)
  return renderer
}

function computeCappedDPR() {
  const lod = Session.getLod()
  let dpr = 2
  if (lod === 0) {
    dpr = 0.5 // Pixelated
  } else if (lod <= 4) {
    dpr = 1 // Pixel-perfect
  }
  return dpr
}
