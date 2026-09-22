import {
  Box2,
  CanvasTexture,
  Color,
  SRGBColorSpace,
  Texture,
  Vector2,
  Vector4,
  WebGLRenderTarget,
  WebGLRenderer,
} from "three"
import { ImageCrop } from "./imagecrop"

const COLUMNS = 8
const ROWS = 4
const WIDTH = 512
const HEIGHT = 256
const TOTAL = COLUMNS * ROWS
const HIDDEN_COLOR = new Color(0x1c1c1c)

/** Query parameter naming the source image, e.g. ?image=assets/wave.jpg */
const IMAGE_PARAM = "image"

/** Side of one square tile; 512/8 and 256/4 are both 64. */
export const TILE_SIZE = WIDTH / COLUMNS

export type TileRect = { x: number; y: number }

/** Number of tiles to have revealed for a revealed fraction of the image. */
export function revealCount(fraction: number): number {
  if (!Number.isFinite(fraction)) {
    return 0
  }
  return Math.round(Math.min(1, Math.max(0, fraction)) * TOTAL)
}

/**
 * Grid position of a tile in texture space. Source and render target textures
 * are both addressed bottom-up, so the copy region and the destination origin
 * share the same y.
 */
export function tileRect(index: number): TileRect {
  const column = index % COLUMNS
  const row = Math.floor(index / COLUMNS)
  return {
    x: column * TILE_SIZE,
    y: HEIGHT - (row + 1) * TILE_SIZE,
  }
}

/**
 * Progressive image reveal over the 8x4 square tile grid. Holds the complete
 * image as a source texture and the current result as a render target, then
 * copies whole square regions across on demand - the reveal is a GPU texture
 * copy, not a mesh per tile.
 *
 * Usable before (and without) the image: the texture is always the flat hidden
 * state until tiles are copied in, so it can be attached to the table cloth
 * immediately. Reveal levels requested while loading are applied on load.
 */
export class RevealTexture {
  private readonly renderer: WebGLRenderer | undefined
  private readonly hidden: CanvasTexture
  private readonly target: WebGLRenderTarget | null
  private source: Texture | null = null
  private order: number[] = []
  private level = 0
  private revealed = 0

  constructor(renderer?: WebGLRenderer) {
    this.renderer = renderer
    this.hidden = RevealTexture.solidTexture(HIDDEN_COLOR)
    const target = renderer ? new WebGLRenderTarget(WIDTH, HEIGHT) : null
    if (renderer && target) {
      target.texture.colorSpace = SRGBColorSpace
      target.texture.generateMipmaps = false
      renderer.initRenderTarget(target)
    }
    this.target = target
    this.reset()
  }

  /**
   * Build a reveal texture from the optional ?image=url query parameter, or
   * null when no image was supplied. Loading starts immediately.
   */
  static fromLocation(renderer?: WebGLRenderer): RevealTexture | null {
    const url = new URLSearchParams(globalThis.location?.search ?? "").get(
      IMAGE_PARAM
    )
    if (!url) {
      return null
    }
    const reveal = new RevealTexture(renderer)
    reveal.load(url)
    return reveal
  }

  /** The hidden state until the image loads, then the progressively revealed image. */
  get texture(): Texture {
    return this.target ? this.target.texture : this.hidden
  }

  get total(): number {
    return TOTAL
  }

  get revealedCount(): number {
    return this.revealed
  }

  get isReady(): boolean {
    return this.source !== null
  }

  /** Load and crop the image, then apply any reveal level already requested. */
  load(url: string, ready?: () => void): void {
    console.log("[RevealTexture] loading", url)
    const image = new Image()
    image.crossOrigin = "anonymous"
    image.onload = () => {
      const source = ImageCrop.texture(image, WIDTH, HEIGHT)
      this.source = source
      if (this.renderer) {
        this.renderer.initTexture(source)
      }
      this.paint()
      const sourceWidth = image.naturalWidth || image.width
      const sourceHeight = image.naturalHeight || image.height
      const { rotated } = ImageCrop.orient(
        sourceWidth,
        sourceHeight,
        WIDTH,
        HEIGHT
      )
      console.log(
        "[RevealTexture] loaded",
        url,
        `${sourceWidth}x${sourceHeight} -> ${WIDTH}x${HEIGHT}${rotated ? " rotated" : ""}`,
        `${this.revealed}/${TOTAL} tiles revealed`
      )
      ready?.()
    }
    image.onerror = () => {
      console.error("[RevealTexture] failed to load image", url)
      void RevealTexture.reportFailure(url)
    }
    image.src = url
  }

  /**
   * The image error event carries no reason, so ask the network directly for
   * one: an HTTP status means the URL is wrong, a rejection means the request
   * never completed (offline, blocked, or missing the CORS header).
   */
  private static async reportFailure(url: string): Promise<void> {
    try {
      const response = await fetch(url, { method: "HEAD" })
      console.error(
        `[RevealTexture] ${url} responded ${response.status} ${response.statusText}`
      )
    } catch (error) {
      console.error(
        `[RevealTexture] ${url} request failed (offline, blocked, or no CORS header)`,
        error
      )
    }
  }

  /**
   * Reveal the fraction of the image potted so far, rounded to whole tiles.
   * Levels only ever advance, so repeated or regressed calls cost nothing.
   * Returns the number of tiles revealed by this call.
   */
  reveal(fraction: number): number {
    const target = revealCount(fraction)
    if (target <= this.level) {
      return 0
    }
    this.level = target
    const before = this.revealed
    this.paint()
    const revealed = this.revealed - before
    if (revealed > 0) {
      console.log(
        `[RevealTexture] revealed ${revealed} tile(s), ${this.revealed}/${TOTAL}`
      )
    } else {
      console.log(
        `[RevealTexture] level set to ${target}/${TOTAL}, waiting for the image`
      )
    }
    return revealed
  }

  /** Start again from the hidden state, with a fresh tile order. */
  reset(): void {
    this.order = RevealTexture.shuffle([...Array(TOTAL).keys()])
    this.level = 0
    this.revealed = 0
    this.repaint()
  }

  dispose(): void {
    this.target?.dispose()
    this.source?.dispose()
    this.hidden.dispose()
    this.source = null
  }

  private paint(): void {
    const renderer = this.renderer
    const target = this.target
    const source = this.source
    if (!renderer || !target || !source) {
      return
    }
    while (this.revealed < this.level) {
      const { x, y } = tileRect(this.order[this.revealed])
      renderer.copyTextureToTexture(
        source,
        target.texture,
        new Box2(new Vector2(x, y), new Vector2(x + TILE_SIZE, y + TILE_SIZE)),
        new Vector2(x, y)
      )
      this.revealed++
    }
  }

  private repaint(): void {
    const renderer = this.renderer
    const target = this.target
    if (!renderer || !target) {
      return
    }
    const previousTarget = renderer.getRenderTarget()
    const previousClear = renderer.getClearColor(new Color())
    const previousAlpha = renderer.getClearAlpha()
    const previousScissorTest = renderer.getScissorTest()
    const previousScissor = renderer.getScissor(new Vector4())

    renderer.setRenderTarget(target)
    renderer.setScissorTest(false)
    renderer.setClearColor(HIDDEN_COLOR, 1)
    renderer.clear(true, true, true)

    renderer.setRenderTarget(previousTarget)
    renderer.setScissorTest(previousScissorTest)
    renderer.setScissor(
      previousScissor.x,
      previousScissor.y,
      previousScissor.z,
      previousScissor.w
    )
    renderer.setClearColor(previousClear, previousAlpha)
  }

  private static shuffle(values: number[]): number[] {
    for (let i = values.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[values[i], values[j]] = [values[j], values[i]]
    }
    return values
  }

  private static solidTexture(color: Color): CanvasTexture {
    const canvas = document.createElement("canvas")
    canvas.width = 16
    canvas.height = 16
    const ctx = canvas.getContext("2d")
    if (ctx) {
      ctx.fillStyle = `#${color.getHexString()}`
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }
    const texture = new CanvasTexture(canvas)
    texture.colorSpace = SRGBColorSpace
    return texture
  }
}
