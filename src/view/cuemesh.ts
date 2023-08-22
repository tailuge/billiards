import { up } from "../utils/utils"
import {
  Matrix4,
  Mesh,
  CylinderGeometry,
  MeshPhongMaterial,
  Vector3,
} from "three"

export class CueMesh {
  private static readonly material = new MeshPhongMaterial({
    color: 0x885577,
    wireframe: false,
    flatShading: false,
  })

  private static readonly helpermaterial = new MeshPhongMaterial({
    color: 0x885577,
    wireframe: false,
    flatShading: true,
    transparent: true,
    opacity: 0.25,
  })

  static createHelper() {
    const geometry = new CylinderGeometry(0.5, 0.5, 30, 12)
    const mesh = new Mesh(geometry, CueMesh.helpermaterial)
    mesh.geometry
      .applyMatrix4(new Matrix4().identity().makeRotationAxis(up, -Math.PI / 2))
      .applyMatrix4(new Matrix4().identity().makeTranslation(15, 0, 0))
    mesh.visible = false
    return mesh
  }

  static createPlacer() {
    const geometry = new CylinderGeometry(0.01, 0.5, 0.5, 4)
    const mesh = new Mesh(geometry, CueMesh.helpermaterial)
    mesh.geometry
      .applyMatrix4(
        new Matrix4()
          .identity()
          .makeRotationAxis(new Vector3(1, 0, 0), -Math.PI / 2)
      )
      .applyMatrix4(new Matrix4().identity().makeTranslation(0, 0, 0.7))
    mesh.visible = false
    return mesh
  }

  static createCue(tip, but, length) {
    const geometry = new CylinderGeometry(tip, but, length, 11)
    const mesh = new Mesh(geometry, CueMesh.material)
    mesh.castShadow = false
    mesh.geometry
      .applyMatrix4(
        new Matrix4()
          .identity()
          .makeRotationAxis(new Vector3(1.0, 0.0, 0.0), -0.1)
      )
      .applyMatrix4(new Matrix4().identity().makeRotationAxis(up, -Math.PI / 2))
      .applyMatrix4(
        new Matrix4().identity().makeTranslation(-length / 2 - 0.5, 0, 1)
      )
    return mesh
  }
}
