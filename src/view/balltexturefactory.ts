import { CanvasTexture, Color } from "three"

export class BallTextureFactory {
  private static textureCache: Map<string, CanvasTexture> = new Map()

  static getOrCreateTexture(label: number, color: Color): CanvasTexture {
    const key = `${label}_${color.getHex()}`
    if (this.textureCache.has(key)) {
      return this.textureCache.get(key)!
    }

    const texture = this.createNumberTexture(label, color)
    this.textureCache.set(key, texture)
    return texture
  }

  private static createNumberTexture(
    label: number,
    color: Color
  ): CanvasTexture {
    const size = 256
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

    // Noise
    const rand = () => Math.random() * size
    const noiseAlpha = 0.01
    for (let i = 0; i < 100; i++) {
      ctx.fillStyle =
        Math.random() > 0.5
          ? `rgba(255,255,255,${noiseAlpha})`
          : `rgba(0,0,0,${noiseAlpha})`
      ctx.fillRect(rand(), rand(), 10, 10)
    }

    // Stripes for Nineball (9-15)
    if (label >= 9) {
      ctx.fillStyle = "white"
      ctx.fillRect(0, 0, size, size / 4)
      ctx.fillRect(0, (size * 3) / 4, size, size / 4)
    }

    if (label > 0) {
      const centerX = size / 2
      const centerY = size / 2
      const radius = 53

      // Black circle (border)
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius + 5, 0, Math.PI * 2)
      ctx.fillStyle = "black"
      ctx.fill()

      // White circle
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
      ctx.fillStyle = "white"
      ctx.fill()

      // Number
      ctx.fillStyle = "black"
      ctx.font = "bold 80px Arial, sans-serif"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(label.toString(), centerX, centerY + 5)
    }

    const texture = new CanvasTexture(canvas)
    texture.flipY = false
    return texture
  }
}
