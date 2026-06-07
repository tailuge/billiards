import { expect } from "chai"
import {
  Color,
  MeshPhongMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
} from "three"
import { BallMaterialFactory } from "../../src/view/ballmaterialfactory"
import { R } from "../../src/model/physics/constants"
import { Session } from "../../src/network/client/session"

describe("BallMaterialFactory", () => {
  beforeEach(() => {
    Session.reset()
  })

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

  it("creates a textured dots material with cubemap shader hooks", () => {
    const color = new Color(0xffeecc)
    const material = BallMaterialFactory.createTexturedDotsMaterial(color)

    expect(material).to.be.an.instanceOf(MeshPhysicalMaterial)
    expect(material.color.getHex()).to.equal(color.getHex())

    const shader = {
      uniforms: {} as any,
      vertexShader: "#include <begin_vertex>",
      fragmentShader: "#include <color_fragment>",
    }

    if (material.onBeforeCompile) {
      material.onBeforeCompile(shader)
    }

    expect(shader.uniforms.uCubeMap).to.exist
    expect(shader.vertexShader).to.contain("varying vec3 vLocalPos;")
    expect(shader.fragmentShader).to.contain("uniform samplerCube uCubeMap;")
    expect(shader.fragmentShader).to.contain(
      "textureCube(uCubeMap, normalize(vLocalPos))"
    )
  })

  it("applies environment map when LOD >= 4", () => {
    Session.init("test", "player", "table", false, false, false, 4)
    const color = new Color(0xffffff)

    const dotted = BallMaterialFactory.createDottedMaterial(color)
    expect(dotted).to.be.an.instanceOf(MeshPhongMaterial)
    expect(dotted.envMap).to.not.be.null

    const textured = BallMaterialFactory.createTexturedDotsMaterial(color)
    expect(textured).to.be.an.instanceOf(MeshPhysicalMaterial)
    expect(textured.envMap).to.not.be.null

    const projected = BallMaterialFactory.createProjectedMaterial(1, color)
    expect(projected).to.be.an.instanceOf(MeshPhysicalMaterial)
    expect(projected.envMap).to.not.be.null
  })

  it("does not apply environment map when LOD < 4", () => {
    Session.init("test", "player", "table", false, false, false, 3)
    const color = new Color(0xffffff)

    const dotted = BallMaterialFactory.createDottedMaterial(color)
    expect(dotted.envMap).to.be.null

    const textured = BallMaterialFactory.createTexturedDotsMaterial(color)
    expect(textured.envMap).to.be.null

    const projected = BallMaterialFactory.createProjectedMaterial(1, color)
    expect(projected.envMap).to.be.null
  })
})
