import {
  PerspectiveCamera,
  WebGLRenderTarget,
  SRGBColorSpace,
  Vector4,
} from "three"
import { CameraTop } from "./cameratop"
import { up } from "../utils/three-utils"
import { R } from "../model/physics/constants"

const WIDTH = 252
const HEIGHT = 136

/**
 * Static top-down minimap. Renders the game scene once from directly above
 * into a canvas pinned to the top-left of the screen; the D key toggles it.
 * The captured image is static until the next toggle - no per-frame work.
 */
export class Minimap {
  private readonly scene
  private readonly renderer
  private readonly canvas: HTMLCanvasElement | null
  private readonly ctx: CanvasRenderingContext2D | null
  private readonly pixels: Uint8Array | null
  private camera: PerspectiveCamera | null = null
  private target: WebGLRenderTarget | null = null
  private captured = false
  private keyHeld = false

  constructor(scene, renderer) {
    this.scene = scene
    this.renderer = renderer
    this.canvas = document.getElementById("minimap") as HTMLCanvasElement | null
    this.ctx = this.canvas ? this.canvas.getContext("2d") : null
    this.pixels = this.ctx ? new Uint8Array(WIDTH * HEIGHT * 4) : null
  }

  /** Called on every KeyD repeat while held; toggles only on the first press. */
  keyDown() {
    if (this.keyHeld) {
      return
    }
    this.keyHeld = true
    this.toggle()
  }

  keyUp() {
    this.keyHeld = false
  }

  /** Hide the minimap (no-op if not shown). */
  hide() {
    if (this.canvas) {
      this.canvas.hidden = true
    }
  }

  /** Toggle the minimap; each show re-captures a fresh static image. */
  toggle() {
    if (!this.canvas) {
      return
    }
    if (this.canvas.hidden) {
      this.capture()
      if (this.captured) {
        this.canvas.hidden = false
      }
    } else {
      this.hide()
    }
  }

  /** Render the scene once from above into the minimap canvas. */
  capture() {
    const renderer = this.renderer
    if (!renderer || !this.ctx || !this.pixels) {
      return
    }
    if (!this.camera || !this.target) {
      this.camera = new PerspectiveCamera(
        CameraTop.fov,
        WIDTH / HEIGHT,
        R,
        R * 1000
      )
      this.target = new WebGLRenderTarget(WIDTH, HEIGHT)
      this.target.texture.colorSpace = SRGBColorSpace
    }
    const camera = this.camera
    const target = this.target

    camera.position.copy(CameraTop.viewPoint(WIDTH / HEIGHT, CameraTop.fov))
    camera.up.copy(up)
    camera.lookAt(0, 0, 0)
    camera.updateProjectionMatrix()

    // Save the main renderer state so the 3D view is unaffected.
    const previousTarget = renderer.getRenderTarget()
    const previousPixelRatio = renderer.getPixelRatio()
    const previousViewport = renderer.getViewport(new Vector4())
    const previousScissor = renderer.getScissor(new Vector4())
    const previousScissorTest = renderer.getScissorTest()

    renderer.setPixelRatio(1)
    renderer.setRenderTarget(target)
    renderer.setViewport(0, 0, WIDTH, HEIGHT)
    renderer.setScissor(0, 0, WIDTH, HEIGHT)
    renderer.setScissorTest(false)
    renderer.clear()
    renderer.render(this.scene, camera)
    renderer.readRenderTargetPixels(target, 0, 0, WIDTH, HEIGHT, this.pixels)

    // WebGL reads rows bottom-up; canvas 2D expects top-down.
    const imageData = this.ctx.createImageData(WIDTH, HEIGHT)
    for (let y = 0; y < HEIGHT; y++) {
      const source = (HEIGHT - 1 - y) * WIDTH * 4
      imageData.data.set(
        this.pixels.subarray(source, source + WIDTH * 4),
        y * WIDTH * 4
      )
    }
    this.ctx.putImageData(imageData, 0, 0)
    this.captured = true

    renderer.setRenderTarget(previousTarget)
    renderer.setViewport(
      previousViewport.x,
      previousViewport.y,
      previousViewport.z,
      previousViewport.w
    )
    renderer.setScissor(
      previousScissor.x,
      previousScissor.y,
      previousScissor.z,
      previousScissor.w
    )
    renderer.setScissorTest(previousScissorTest)
    renderer.setPixelRatio(previousPixelRatio)
  }
}
