import {
  CanvasTexture,
  EquirectangularReflectionMapping,
  TextureLoader,
} from "three"

export class BallEnvMapFactory {
  private static envMap: CanvasTexture | null = null

  static getEnvMap(): CanvasTexture {
    if (this.envMap) {
      return this.envMap
    }

    const canvas = document.createElement("canvas")
    canvas.width = 512
    canvas.height = 256
    const ctx = canvas.getContext("2d")

    if (ctx) {
      // Simple room placeholder: sky-ish top, dark bottom, some lights
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      gradient.addColorStop(0, "#222233")
      gradient.addColorStop(0.5, "#111111")
      gradient.addColorStop(1, "#222222")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Fake lights
      ctx.fillStyle = "#ffffff"
      ctx.beginPath()
      ctx.arc(128, 64, 20, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = "#ffffcc"
      ctx.beginPath()
      ctx.arc(384, 80, 15, 0, Math.PI * 2)
      ctx.fill()
    }

    this.envMap = new CanvasTexture(canvas)
    this.envMap.mapping = EquirectangularReflectionMapping

    // Try to load room.jpg
    if (typeof process === "undefined") {
      new TextureLoader().load(
        "room.jpg",
        (texture) => {
          if (this.envMap) {
            this.envMap.image = texture.image
            this.envMap.needsUpdate = true
          }
        },
        undefined,
        () => {
          // Silent fail as it is a placeholder
        }
      )
    }

    return this.envMap
  }
}
