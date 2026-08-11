import { expect } from "chai"
import { Box3, Group, Mesh, MeshPhongMaterial } from "three"
import { R } from "../../src/model/physics/constants"
import { CueMesh, DEFAULT_CUE_PARAMS } from "../../src/view/cuemesh"

// Same dimensions as dist/cue.html's GEO so the port is directly comparable.
const tip = (R * 0.07) / 0.5
const butt = (R * 0.23) / 0.5
const length = 1.47

describe("CueMesh geometry port", () => {
  test("DEFAULT_CUE_PARAMS mirror dist/cue.html's DEFAULT_STATE", () => {
    expect(DEFAULT_CUE_PARAMS).to.deep.equal({
      shaftColour: "#d2b48c",
      buttColour: "#0d0d0d",
      jointColour: "#2b2f36",
      jointLength: 0.004,
      ferruleColour: "#e5e5e5",
      ferruleLength: 0.015,
      buttRatio: 0.4,
      grain: true,
    })
  })

  test("default cue spans the full length with a named tip", () => {
    const group = CueMesh.cueGeometry(tip, butt, length)
    const box = new Box3().setFromObject(group)
    expect(box.min.y).to.be.closeTo(-length / 2, 0.001)
    expect(box.max.y).to.be.closeTo(length / 2, 0.01)
    expect(group.getObjectByName("cueTip")?.name).to.equal("cueTip")
  })

  test("custom params keep the total cue length fixed", () => {
    const group = CueMesh.cueGeometry(tip, butt, length, 11, {
      buttRatio: 0.5,
      jointLength: 0.03,
      ferruleLength: 0.02,
    })
    const box = new Box3().setFromObject(group)
    expect(box.max.y - box.min.y).to.be.closeTo(length, 0.01)
  })

  test("cue is built from splice, cap, joint, shaft, ferrule and tip parts", () => {
    const group = CueMesh.cueGeometry(tip, butt, length)
    // 2 splice meshes + cap + joint + shaft + ferrule + tip
    expect(group.children).to.have.lengthOf(7)
  })

  test("grain param toggles the wood textures", () => {
    const phongMats = (group: Group) =>
      group.children
        .map((c) => (c as Mesh).material)
        .filter((m) => m instanceof MeshPhongMaterial) as MeshPhongMaterial[]

    const withGrain = CueMesh.cueGeometry(tip, butt, length)
    expect(phongMats(withGrain).some((m) => m.map !== null)).to.be.true

    const withoutGrain = CueMesh.cueGeometry(tip, butt, length, 11, {
      grain: false,
    })
    expect(phongMats(withoutGrain).every((m) => m.map === null)).to.be.true
  })

  test("createCue returns the unchanged mesh/tiltMesh/cueBody hierarchy", () => {
    const { mesh, tiltMesh, cueBody } = CueMesh.createCue(tip, butt, length)
    expect(mesh.type).to.equal("Group")
    expect(tiltMesh.rotation.y).to.equal(CueMesh.baseTilt)
    expect(cueBody.children.length).to.be.greaterThan(0)
  })
})
