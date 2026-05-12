import { CanvasTexture, Color } from "three"

export class ClothTextureFactory {
  private static readonly cache = new Map<string, CanvasTexture>()

  static getOrCreate(
    color: Color = new Color(0x0d5c2e),
    size = 512
  ): CanvasTexture {
    const key = `${color.getHex()}_${size}`
    if (this.cache.has(key)) {
      return this.cache.get(key)!
    }

    const texture = this.createFeltTexture(color, size)
    this.cache.set(key, texture)
    return texture
  }

  private static createFeltTexture(color: Color, size: number): CanvasTexture {
    const canvas = document.createElement("canvas")
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext("2d")!
    const imageData = ctx.createImageData(size, size)
    const data = imageData.data

    const r = Math.round(color.r * 255)
    const g = Math.round(color.g * 255)
    const b = Math.round(color.b * 255)

    for (let i = 0; i < data.length; i += 4) {
      const x = (i / 4) % size
      const y = Math.floor(i / 4 / size)

      const noise = (Math.random() - 0.5) * 14

      const weaveX = Math.sin((x / size) * Math.PI * 64) * 3
      const weaveY = Math.sin((y / size) * Math.PI * 64) * 3
      const weave = weaveX * 0.5 + weaveY * 0.5

      data[i] = Math.max(0, Math.min(255, r + noise + weave))
      data[i + 1] = Math.max(0, Math.min(255, g + noise * 0.7 + weave * 0.3))
      data[i + 2] = Math.max(0, Math.min(255, b + noise * 0.4))
      data[i + 3] = 255
    }

    ctx.putImageData(imageData, 0, 0)

    const texture = new CanvasTexture(canvas)
    texture.wrapS = texture.wrapT = 1000
    texture.anisotropy = 4
    return texture
  }
}
