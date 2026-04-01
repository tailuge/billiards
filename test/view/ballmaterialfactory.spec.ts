import { expect } from "chai"
import { Color, MeshStandardMaterial } from "three"
import { BallMaterialFactory } from "../../src/view/ballmaterialfactory"
import { R } from "../../src/model/physics/constants"

describe("BallMaterialFactory", () => {
  it("creates a projected material with correct uniforms", () => {
    const color = new Color(0xff0000)
    const label = 8
    const material = BallMaterialFactory.createProjectedMaterial(label, color)

    expect(material).to.be.an.instanceOf(MeshStandardMaterial)
    expect(material.color.getHex()).to.equal(color.getHex())

    // Mock shader object for onBeforeCompile
    const shader = {
      uniforms: {} as any,
      vertexShader: "#include <common>\n#include <begin_vertex>",
      fragmentShader: "#include <common>\n#include <color_fragment>",
    }

    if (material.onBeforeCompile) {
      material.onBeforeCompile(shader)
    }

    expect(shader.uniforms.numberTex).to.exist
    expect(shader.uniforms.invScale.value).to.equal(1 / (R * 2))

    expect(shader.vertexShader).to.contain("varying vec3 vLocalPosition;")
    expect(shader.vertexShader).to.not.contain("varying vec3 vNormalVar;")

    expect(shader.fragmentShader).to.contain("uniform float invScale;")
    expect(shader.fragmentShader).to.contain(
      "vLocalPosition.xz * invScale + 0.5"
    )
    expect(shader.fragmentShader).to.not.contain("float r =")
  })

  it("caches materials", () => {
    const color = new Color(0x00ff00)
    const label = 9
    const mat1 = BallMaterialFactory.createProjectedMaterial(label, color)
    const mat2 = BallMaterialFactory.createProjectedMaterial(label, color)
    expect(mat1).to.equal(mat2)
  })
})
