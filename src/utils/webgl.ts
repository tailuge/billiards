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
    alpha: false,
  })

  renderer.shadowMap.enabled = false
  renderer.autoClear = false
  renderer.outputColorSpace = SRGBColorSpace
  renderer.toneMapping = NoToneMapping
  renderer.sortObjects = false
  renderer.setSize(element.offsetWidth, element.offsetHeight)
  renderer.setPixelRatio(computeCappedDPR(element.offsetWidth, element.offsetHeight))
  renderer.domElement.draggable = false
  renderer.domElement.style.userSelect = "none"
  renderer.domElement.addEventListener("dragstart", (e) => e.preventDefault())
  element.appendChild(renderer.domElement)
  return renderer
}

function computeCappedDPR(width: number, height: number) {
  const maxPixels = 2_000_000;
  const deviceDPR = window.devicePixelRatio || 1;

  let dpr = deviceDPR;
  const pixels = width * height * dpr * dpr;

  if (pixels > maxPixels) {
    dpr = Math.sqrt(maxPixels / (width * height));
  }

  // 1. Clamp to 1 max as per your original requirement
  dpr = Math.min(dpr, 1);

  // 2. Round to the nearest 0.25 increment
  // Use Math.floor if you want to be conservative with performance
  dpr = Math.round(dpr * 4) / 4;

  // 3. Ensure a minimum floor (e.g., 0.25) so it doesn't disappear
  return Math.max(dpr, 0.25);
}
