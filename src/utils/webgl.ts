import { WebGLRenderer, SRGBColorSpace, NoToneMapping } from "three"

export function renderer(element: HTMLElement) {
  if (typeof process !== "undefined") {
    return undefined
  }

  const renderer = new WebGLRenderer({
    antialias: false,
    depth: true,
    powerPreference: "high-performance",
    stencil: false,
  })

  renderer.shadowMap.enabled = false
  renderer.autoClear = false
  renderer.outputColorSpace = SRGBColorSpace
  renderer.toneMapping = NoToneMapping
  renderer.setSize(element.offsetWidth, element.offsetHeight)
  renderer.setPixelRatio(window.devicePixelRatio * 0.75)
  renderer.domElement.draggable = false
  renderer.domElement.style.userSelect = "none"
  renderer.domElement.addEventListener("dragstart", (e) => e.preventDefault())
  element.appendChild(renderer.domElement)
  return renderer
}
