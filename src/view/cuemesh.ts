import { up } from "../utils/utils"
import {
  Matrix4,
  Mesh,
  CylinderGeometry,
  MeshPhongMaterial,
  Vector3,
  ShaderMaterial,
} from "three"

export class CueMesh {
  private static readonly material = new MeshPhongMaterial({
    color: 0x885577,
    wireframe: false,
    flatShading: false,
  })

  private static readonly helpermaterial = new ShaderMaterial({
    uniforms: {
      lightDirection: { value: new Vector3(0, 0, 1) },
    },
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vNormal;  
      void main() {
        vNormal = normal;
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
      }
    `,
    fragmentShader: `
      varying vec2 vUv;
      varying vec3 vNormal;
      uniform vec3 lightDirection;
      void main() {
        float intensity = dot(vNormal, lightDirection);
        vec3 color = vec3(1.0, 1.0, 1.0);
        vec3 finalColor = color * intensity;
        gl_FragColor = vec4(finalColor, 0.05 * (1.0-vUv.y));
      }
    `,
    wireframe: false,
    transparent: true,
  })

  static createHelper() {
    const geometry = new CylinderGeometry(0.5, 0.5, 30, 12, 1, true)
    const mesh = new Mesh(geometry, this.helpermaterial)
    mesh.geometry
      .applyMatrix4(new Matrix4().identity().makeRotationAxis(up, -Math.PI / 2))
      .applyMatrix4(new Matrix4().identity().makeTranslation(15, 0, -0.01))
    mesh.visible = false
    mesh.renderOrder = -1
    mesh.material.depthTest = false
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
