import { Color, CubeTexture } from "three"

export class BallCubeTextureFactory {
  private static readonly textureCache: Map<string, CubeTexture> = new Map()
  private static readonly dotColor = "#cc0000"

  static getOrCreateTexture(color: Color, size = 128, dotScale = 0.1) {
    const key = `${color.getHex()}_${size}_${dotScale}`
    if (this.textureCache.has(key)) {
      return this.textureCache.get(key)!
    }

    const texture = this.createTexture(color, size, dotScale)
    this.textureCache.set(key, texture)
    return texture
  }

  private static createTexture(color: Color, size: number, dotScale: number) {
    const canvas = document.createElement("canvas")
    canvas.width = size
    canvas.height = size
    dotScale = color.getHexString() === "ff0000" ? 0.08 : dotScale
    const dotColor =
      color.getHexString() === "ff0000" ? "#ffffff" : this.dotColor

    const ctx = canvas.getContext("2d")
    if (ctx) {
      ctx.fillStyle = `#${color.getHexString()}`
      ctx.fillRect(0, 0, size, size)

      ctx.beginPath()
      ctx.arc(size / 2, size / 2, size * dotScale, 0, Math.PI * 2)
      ctx.fillStyle = dotColor
      ctx.fill()
    }

    const texture = new CubeTexture(Array(6).fill(canvas))
    texture.needsUpdate = true
    return texture
  }
}
