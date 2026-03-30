import { WebGLRenderer } from "three"

export function renderer(element: HTMLElement) {
  if (typeof process !== "undefined") {
    return undefined
  }

  const renderer = new WebGLRenderer({
    antialias: false,
    depth: true,
    powerPreference: "high-performance",
    stencil: false
  })

  renderer.shadowMap.enabled = false
  renderer.autoClear = false
  renderer.setSize(element.offsetWidth, element.offsetHeight)
  renderer.setPixelRatio(window.devicePixelRatio * 0.5)
  element.appendChild(renderer.domElement)
  return renderer
}
