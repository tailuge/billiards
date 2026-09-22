import { CanvasTexture, SRGBColorSpace } from "three"

/**
 * Fits a source image to a fixed target size without distortion or
 * letterboxing: the source is first oriented so its long axis lands on the
 * target's long axis (a portrait source is rotated onto a landscape target),
 * then centre-cropped and scaled.
 *
 * The rotation trades content for coverage - a 1000x1400 portrait keeps its
 * full long axis and 70% of its short axis rather than 100% of the width and
 * 36% of the height - so the image reads sideways in the texture.
 */
export class ImageCrop {
  /** Largest centred rect inside the source that has the target aspect ratio. */
  static coverRect(
    sourceWidth: number,
    sourceHeight: number,
    targetWidth: number,
    targetHeight: number
  ) {
    const aspect = targetWidth / targetHeight
    const width = Math.min(sourceWidth, sourceHeight * aspect)
    const height = width / aspect
    return {
      x: (sourceWidth - width) / 2,
      y: (sourceHeight - height) / 2,
      width,
      height,
    }
  }

  /**
   * Rect to crop, in the space of the source once it has been oriented onto
   * the target's long axis, plus whether that orientation needs a rotation.
   */
  static orient(
    sourceWidth: number,
    sourceHeight: number,
    targetWidth: number,
    targetHeight: number
  ) {
    const rotated = sourceWidth > sourceHeight !== targetWidth > targetHeight
    const width = rotated ? sourceHeight : sourceWidth
    const height = rotated ? sourceWidth : sourceHeight
    return {
      ...ImageCrop.coverRect(width, height, targetWidth, targetHeight),
      rotated,
    }
  }

  /** Crop, orient, scale and upload the image as a texture of exactly target size. */
  static texture(
    image: HTMLImageElement,
    targetWidth: number,
    targetHeight: number
  ): CanvasTexture {
    const sourceWidth = image.naturalWidth || image.width
    const sourceHeight = image.naturalHeight || image.height
    const crop = ImageCrop.orient(
      sourceWidth,
      sourceHeight,
      targetWidth,
      targetHeight
    )

    const canvas = document.createElement("canvas")
    canvas.width = targetWidth
    canvas.height = targetHeight
    const ctx = canvas.getContext("2d")
    if (ctx) {
      ctx.save()
      // Map the crop rect onto the whole canvas...
      ctx.translate(targetWidth / 2, targetHeight / 2)
      ctx.scale(targetWidth / crop.width, targetHeight / crop.height)
      ctx.translate(-(crop.x + crop.width / 2), -(crop.y + crop.height / 2))
      // ...after turning the source's long axis onto the target's.
      if (crop.rotated) {
        ctx.translate(sourceHeight, 0)
        ctx.rotate(Math.PI / 2)
      }
      ctx.drawImage(image, 0, 0, sourceWidth, sourceHeight)
      ctx.restore()
    }

    const texture = new CanvasTexture(canvas)
    texture.colorSpace = SRGBColorSpace
    return texture
  }
}
