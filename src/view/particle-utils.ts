export class ParticleUtils {
  static generateTextCanvas(
    text: string,
    width: number,
    height: number,
    fontStack: string
  ): HTMLCanvasElement {
    const canvas = document.createElement("canvas")
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext("2d")
    if (!ctx) return canvas

    ctx.fillStyle = "#040b9fff"
    ctx.fillRect(0, 0, width, height)
    let fontSize = 60
    ctx.font = `bold ${fontSize}px ${fontStack}`
    while (fontSize > 5) {
      ctx.font = `bold ${fontSize}px ${fontStack}`
      const metrics = ctx.measureText(text)
      if (metrics.width < width * 0.9 && fontSize * 0.8 < height * 0.8) break
      fontSize--
    }
    ctx.fillStyle = "white"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(text, width / 2, height / 2)
    return canvas
  }
}
