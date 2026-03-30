import { R } from "../model/physics/constants"
import { up } from "../utils/three-utils"
import {
  Matrix4,
  Mesh,
  CylinderGeometry,
  MeshPhongMaterial,
  Vector3,
  ShaderMaterial,
  Group,
  PlaneGeometry,
  MeshBasicMaterial,
} from "three"

export class CueMesh {
  static mesh: Mesh

  static readonly placermaterial = new MeshPhongMaterial({
    color: 0xccffcc,
    wireframe: false,
    flatShading: false,
    transparent: true,
    opacity: 0.5,
  })

  static indicateValid(valid) {
    CueMesh.placermaterial.color.setHex(valid ? 0xccffcc : 0xff0000)
  }

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
    const geometry = new CylinderGeometry(R, R, (R * 30) / 0.5, 12, 1, true)
    const mesh = new Mesh(geometry, this.helpermaterial)
    mesh.geometry
      .applyMatrix4(new Matrix4().identity().makeRotationAxis(up, -Math.PI / 2))
      .applyMatrix4(
        new Matrix4()
          .identity()
          .makeTranslation((R * 15) / 0.5, 0, (-R * 0.01) / 0.5)
      )
    mesh.visible = false
    mesh.renderOrder = -1
    mesh.material.depthTest = false
    return mesh
  }

  static createPlacer() {
    const geometry = new CylinderGeometry((R * 0.01) / 0.5, R, R, 4)
    const mesh = new Mesh(geometry, CueMesh.placermaterial)
    mesh.geometry
      .applyMatrix4(
        new Matrix4()
          .identity()
          .makeRotationAxis(new Vector3(1, 0, 0), -Math.PI / 2)
      )
      .applyMatrix4(
        new Matrix4().identity().makeTranslation(0, 0, (R * 0.7) / 0.5)
      )
    mesh.visible = false
    return mesh
  }

  static createShadow(length: number) {
    const geometry = new PlaneGeometry(length, R * 0.4)
    geometry.applyMatrix4(
      new Matrix4().identity().makeTranslation(-length / 2 - R, 0, 0)
    )
    const material = new MeshBasicMaterial({
      color: 0x000000,
      opacity: 0.25,
      transparent: true,
      depthWrite: false,
    })
    const mesh = new Mesh(geometry, material)
    mesh.visible = true
    return mesh
  }

  static createCue(tip, but, length) {
    const group = this.cueGeometry(tip, but, length)
    const mesh = new Group()
    mesh.add(group)
    mesh.castShadow = false
    const tilt = 0.17
    group.applyMatrix4(
      new Matrix4().identity().makeRotationAxis(new Vector3(1, 0, 0), -tilt)
    )
    group.applyMatrix4(
      new Matrix4().identity().makeRotationAxis(up, -Math.PI / 2)
    )
    group.applyMatrix4(
      new Matrix4()
        .identity()
        .makeTranslation(
          -length / 2 - R,
          0,
          (length / 2) * Math.sin(tilt) + R * 0.25
        )
    )
    return mesh
  }

  static cueGeometry(tipRadius, buttRadius, length, segments = 9) {
    const group = new Group()

    // Material Definitions
    const ashWoodMat = new MeshPhongMaterial({ color: 0xd2b48c, shininess: 50 })
    const ebonyMat = new MeshPhongMaterial({ color: 0x1a1a1a, shininess: 80 })
    const ferruleMat = new MeshPhongMaterial({
      color: 0xe5e5e5,
      shininess: 100,
    })
    const tipMat = new MeshPhongMaterial({ color: 0x4a7c9a, shininess: 5 })

    // Ratios for a standard snooker cue
    const buttLength = length * 0.28
    const shaftLength = length * 0.71
    const ferruleLength = length * 0.007

    // 1. Butt
    const buttGeom = new CylinderGeometry(
      buttRadius * 0.9,
      buttRadius,
      buttLength,
      segments
    )
    const butt = new Mesh(buttGeom, ebonyMat)
    butt.position.y = -length / 2 + buttLength / 2
    group.add(butt)

    // 2. Shaft
    const shaftGeom = new CylinderGeometry(
      tipRadius,
      buttRadius * 0.9,
      shaftLength,
      segments
    )
    const shaft = new Mesh(shaftGeom, ashWoodMat)
    shaft.position.y = butt.position.y + buttLength / 2 + shaftLength / 2
    group.add(shaft)

    // 3. Ferrule
    const ferruleGeom = new CylinderGeometry(
      tipRadius,
      tipRadius,
      ferruleLength,
      segments
    )
    const ferrule = new Mesh(ferruleGeom, ferruleMat)
    ferrule.position.y = shaft.position.y + shaftLength / 2 + ferruleLength / 2
    group.add(ferrule)

    // 4. Tip
    const tipHeight = 0.0055
    const tipTopRadius = tipRadius * 0.93
    const tipGeom = new CylinderGeometry(
      tipTopRadius,
      tipRadius,
      tipHeight,
      segments
    )
    const tip = new Mesh(tipGeom, tipMat)
    tip.position.y = ferrule.position.y + ferruleLength / 2 + tipHeight / 2
    tip.name = "cueTip"
    group.add(tip)

    return group
  }
}
