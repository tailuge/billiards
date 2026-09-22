import { expect } from "chai"
import { ImageCrop } from "../../src/view/imagecrop"

describe("ImageCrop", () => {
  it("leaves an image of the target aspect uncropped", () => {
    const crop = ImageCrop.coverRect(512, 256, 512, 256)
    expect(crop).to.deep.equal({ x: 0, y: 0, width: 512, height: 256 })
  })

  it("crops the sides of a wide image", () => {
    const crop = ImageCrop.coverRect(1024, 256, 512, 256)
    expect(crop).to.deep.equal({ x: 256, y: 0, width: 512, height: 256 })
  })

  it("crops the top and bottom of a tall image", () => {
    const crop = ImageCrop.coverRect(256, 1024, 512, 256)
    expect(crop).to.deep.equal({ x: 0, y: 448, width: 256, height: 128 })
  })

  it("leaves a landscape source on the target's long axis", () => {
    const crop = ImageCrop.orient(1024, 256, 512, 256)
    // Not rotated: the 4:1 source just loses its outer quarters.
    expect(crop).to.deep.equal({
      x: 256,
      y: 0,
      width: 512,
      height: 256,
      rotated: false,
    })
  })

  it("rotates a portrait source onto the target's long axis", () => {
    const crop = ImageCrop.orient(1000, 1400, 512, 256)
    // Full 1400 long axis kept, 700/1000 of the short axis.
    expect(crop).to.deep.equal({
      x: 0,
      y: 150,
      width: 1400,
      height: 700,
      rotated: true,
    })
  })
})
