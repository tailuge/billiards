import { CanvasTexture, Color } from "three"

export class BallTextureFactory {
  private static readonly textureCache: Map<string, CanvasTexture> = new Map()

  static getOrCreateTexture(
    label: number,
    color: Color,
    size = 256
  ): CanvasTexture {
    const key = `${label}_${color.getHex()}_${size}`
    if (this.textureCache.has(key)) {
      return this.textureCache.get(key)!
    }

    const texture = this.createNumberTexture(label, color, size)
    this.textureCache.set(key, texture)
    return texture
  }

  private static createNumberTexture(
    label: number,
    color: Color,
    size: number
  ): CanvasTexture {
    const scale = size / 256
    const canvas = document.createElement("canvas")
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext("2d")
    if (!ctx) {
      return new CanvasTexture(canvas)
    }

    // Background
    ctx.fillStyle = `#${color.getHexString()}`
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Stripes for Nineball (9-15)
    if (label >= 9) {
      ctx.fillStyle = "white"
      ctx.fillRect(0, 0, size, size * 0.2)
      ctx.fillRect(0, size * 0.8, size, size * 0.2)
    }

    if (label > 0) {
      const centerX = size / 2
      const centerY = size / 2
      const radius = Math.round(52 * scale)
      const border = Math.round(15 * scale)

      // Black circle (border)
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius + border, 0, Math.PI * 2)
      ctx.fillStyle = "black"
      ctx.fill()

      // White circle
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
      ctx.fillStyle = "white"
      ctx.fill()

      // Number
      ctx.fillStyle = "black"
      ctx.strokeStyle = "black"
      const fontSize = Math.round(97 * scale)
      ctx.lineWidth = fontSize * 0.05
      ctx.font = `900 ${fontSize}px "Arial Black", Arial, sans-serif`
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      const textX = centerX
      const textY = centerY + Math.round(5 * scale)
      ctx.strokeText(label.toString(), textX, textY)
      ctx.fillText(label.toString(), textX, textY)
    }

    const texture = new CanvasTexture(canvas)
    texture.flipY = false
    return texture
  }
}
