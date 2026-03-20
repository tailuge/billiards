export class ParticleUtils {
  static colorToRgb(
    color: string,
  ): { r: number; g: number; b: number } {
    const canvas = document.createElement("canvas")
    canvas.width = 1
    canvas.height = 1

    const ctx = canvas.getContext("2d")
    if (!ctx) return { r: 0, g: 0, b: 0 }

    ctx.fillStyle = color
    ctx.fillRect(0, 0, 1, 1)
    const data = ctx.getImageData(0, 0, 1, 1).data

    return { r: data[0], g: data[1], b: data[2] }
  }

  static generateTextCanvas(
    text: string,
    width: number,
    height: number,
    fontStack: string,
    backgroundColor: string = "#040b9f"
  ): HTMLCanvasElement {
    const canvas = document.createElement("canvas")
    canvas.width = width
    canvas.height = height

    const ctx = canvas.getContext("2d")
    if (!ctx) return canvas

    // Background
    ctx.fillStyle = backgroundColor
    ctx.fillRect(0, 0, width, height)

    // Improve rendering quality
    ctx.textAlign = "center"
    ctx.textBaseline = "alphabetic" // important for metrics-based centering

    let fontSize = 60

    // Fit text using real metrics
    while (fontSize > 5) {
      ctx.font = `bold ${fontSize}px ${fontStack}`
      const m = ctx.measureText(text)

      const textHeight = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent

      if (m.width < width * 0.9 && textHeight < height * 0.8) break

      fontSize--
    }

    // Final font set
    ctx.font = `bold ${fontSize}px ${fontStack}, "Apple Color Emoji", "Segoe UI Emoji"`
    ctx.fillStyle = "white"
    // Measure again for accurate placement
    const m = ctx.measureText(text)
    const textHeight = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent

    // True vertical centering + slight perceptual tweak
    const y = height / 2 + (m.actualBoundingBoxAscent - textHeight / 2) + 1 // tweak this (0–2) if needed per font

    ctx.fillText(text, width / 2, y)

    return canvas
  }

  static readonly messages = [
    "🍀WIN",
    "🎲神",
    "(ಠ_ಠ)",
    "👾🕹️",
    "🏆🌍🏆",
    "Void*",
    "🥑💥🥑",
    "🍣",
    "🍡🍘",
    "🥟🍜",
    "🇹🇼🍚🥢",
    "🥬🥤🍛",
    "太魯閣",
    "🐧🧡",
    "(ツ)",
    "水啦",
  ]

  static randomText() {
    return this.messages[Math.floor(Math.random() * this.messages.length)]
  }
}
