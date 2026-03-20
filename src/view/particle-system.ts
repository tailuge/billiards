import {
  Scene,
  BufferGeometry,
  BufferAttribute,
  MeshLambertMaterial,
  InstancedMesh,
  Object3D,
  Color,
  DoubleSide,
} from "three"
import { R } from "../model/physics/constants"
import { ParticleUtils } from "./particle-utils"

export interface ParticleSystemConfig {
  tableWidth?: number
  tableLength?: number
  tableZ?: number
  scaleX?: number
  scaleY?: number
  stopThreshold?: number
  gravity?: number
  baseRestitution?: number
  restitutionVariance?: number
}

const DEFAULT_CONFIG: Required<ParticleSystemConfig> = {
  tableWidth: 88,
  tableLength: 44,
  tableZ: -R * 3.5,
  scaleX: 0.99 * R,
  scaleY: 0.98 * R,
  stopThreshold: 0.25,
  gravity: -1.1,
  baseRestitution: 0.55,
  restitutionVariance: 0.25,
}

export class ParticleSystem {
  private scene: Scene | null = null
  private config: Required<ParticleSystemConfig>
  private count: number = 0
  private pPosX: Float32Array = new Float32Array(0)
  private pPosY: Float32Array = new Float32Array(0)
  private pPosZ: Float32Array = new Float32Array(0)
  private pRot: Float32Array = new Float32Array(0)
  private pVelZ: Float32Array = new Float32Array(0)
  private pRotVel: Float32Array = new Float32Array(0)
  private pDelay: Float32Array = new Float32Array(0)
  private pAge: Float32Array = new Float32Array(0)
  private pState: Uint8Array = new Uint8Array(0)
  private dummy: Object3D = new Object3D()
  private stopZ: number = 0
  private instancedMesh: InstancedMesh | null = null

  constructor(config: ParticleSystemConfig = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config }
    this.count = this.config.tableWidth * this.config.tableLength
  }

  initParticles(scene: Scene) {
    const sourceCanvas = ParticleUtils.generateTextCanvas(
      ParticleUtils.randomText(),
      88,
      44,
      "bold sans-serif"
    )
    this.initialise(scene, sourceCanvas)
  }

  initialise(scene: Scene, sourceCanvas: HTMLCanvasElement): void {
    this.scene = scene
    this.stopZ = this.config.tableZ + 0.1

    this.pPosX = new Float32Array(this.count)
    this.pPosY = new Float32Array(this.count)
    this.pPosZ = new Float32Array(this.count)
    this.pRot = new Float32Array(this.count * 3)
    this.pVelZ = new Float32Array(this.count)
    this.pRotVel = new Float32Array(this.count * 3)
    this.pDelay = new Float32Array(this.count)
    this.pAge = new Float32Array(this.count)
    this.pState = new Uint8Array(this.count)
    this.dummy = new Object3D()

    const ctx = sourceCanvas.getContext("2d")
    if (!ctx) return

    const imgData = ctx.getImageData(
      0,
      0,
      this.config.tableWidth,
      this.config.tableLength
    ).data

    const geo = new BufferGeometry()
    const v = R * 0.8
    const vertices = new Float32Array([-v, -v, 0, v, -v, 0, 0, v, 0])
    geo.setAttribute("position", new BufferAttribute(vertices, 3))
    geo.computeVertexNormals()
    const mat = new MeshLambertMaterial({
      side: DoubleSide,
    })

    this.instancedMesh = new InstancedMesh(geo, mat, this.count)
    this.instancedMesh.castShadow = true
    this.instancedMesh.receiveShadow = true
    this.scene.add(this.instancedMesh)

    const offset = R / 2
    const color = new Color()
    for (let i = 0; i < this.count; i++) {
      const x = i % this.config.tableWidth
      const y = Math.floor(i / this.config.tableWidth)
      const idx = i * 4

      color.setRGB(
        imgData[idx] / 255,
        imgData[idx + 1] / 255,
        imgData[idx + 2] / 255
      )
      this.instancedMesh.setColorAt(i, color)

      this.pPosX[i] =
        offset + (x - this.config.tableWidth / 2) * this.config.scaleX
      this.pPosY[i] =
        -offset + (this.config.tableLength / 2 - y) * this.config.scaleY
      this.pPosZ[i] = 55 * R + Math.random() * 35 * R

      this.pRot[i * 3] = Math.random() * Math.PI
      this.pRot[i * 3 + 1] = Math.random() * Math.PI
      this.pRot[i * 3 + 2] = Math.random() * Math.PI

      this.pVelZ[i] = 0
      this.pRotVel[i * 3] = (Math.random() - 0.5) * 15
      this.pRotVel[i * 3 + 1] = (Math.random() - 0.5) * 15
      this.pRotVel[i * 3 + 2] = (Math.random() - 0.5) * 15

      this.pDelay[i] = Math.random() * 5
      this.pAge[i] = 0
      this.pState[i] = 0

      this.dummy.position.set(this.pPosX[i], this.pPosY[i], this.pPosZ[i])
      this.dummy.rotation.set(
        this.pRot[i * 3],
        this.pRot[i * 3 + 1],
        this.pRot[i * 3 + 2]
      )
      this.dummy.updateMatrix()
      this.instancedMesh.setMatrixAt(i, this.dummy.matrix)
    }
  }

  dispose(): void {
    if (this.instancedMesh && this.scene) {
      this.scene.remove(this.instancedMesh)
      this.instancedMesh.geometry.dispose()
      ;(this.instancedMesh.material as MeshLambertMaterial).dispose()
    }
    this.pPosX = new Float32Array(0)
    this.pPosY = new Float32Array(0)
    this.pPosZ = new Float32Array(0)
    this.pRot = new Float32Array(0)
    this.pVelZ = new Float32Array(0)
    this.pRotVel = new Float32Array(0)
    this.pDelay = new Float32Array(0)
    this.pAge = new Float32Array(0)
    this.pState = new Uint8Array(0)
    this.instancedMesh = null
    this.scene = null
  }

  TWO_PI = Math.PI * 2
  damp = (theta) =>
    ((((theta % Math.PI) * 2 + 3 * Math.PI * 2) % Math.PI) * 2 - Math.PI) * 0.1

  private updateParticle(i: number, dt: number): boolean {
    if (this.pState[i] === 2) return false

    this.pAge[i] += dt
    if (this.pState[i] === 0) {
      if (this.pAge[i] > this.pDelay[i]) {
        this.pState[i] = 1
      } else {
        return false
      }
    }

    this.pVelZ[i] += this.config.gravity * dt
    this.pPosZ[i] += this.pVelZ[i] * dt

    this.pRot[i * 3] += this.pRotVel[i * 3] * dt
    this.pRot[i * 3 + 1] += this.pRotVel[i * 3 + 1] * dt
    this.pRot[i * 3 + 2] += this.pRotVel[i * 3 + 2] * dt

    if (this.pPosZ[i] <= this.stopZ) {
      this.pPosZ[i] = this.stopZ
      if (Math.abs(this.pVelZ[i]) < this.config.stopThreshold) {
        this.pVelZ[i] = 0
        this.pState[i] = 2
        this.pRot[i * 3] = this.damp(this.pRot[i * 3])
        this.pRot[i * 3 + 1] = this.damp(this.pRot[i * 3 + 1])
      } else {
        const varFactor =
          Math.random() * (this.config.restitutionVariance * 2) -
          this.config.restitutionVariance
        this.pVelZ[i] =
          -this.pVelZ[i] * (this.config.baseRestitution * (1 + varFactor))
        this.pRotVel[i * 3] *= 0.5
        this.pRotVel[i * 3 + 1] *= 0.5
        this.pRotVel[i * 3 + 2] *= 0.5
      }
    }

    this.dummy.position.set(this.pPosX[i], this.pPosY[i], this.pPosZ[i])
    this.dummy.rotation.set(
      this.pRot[i * 3],
      this.pRot[i * 3 + 1],
      this.pRot[i * 3 + 2]
    )
    this.dummy.updateMatrix()
    this.instancedMesh!.setMatrixAt(i, this.dummy.matrix)
    return true
  }

  update(dt: number): void {
    if (!this.scene || !this.instancedMesh) return
    const safeDt = Math.min(dt, 0.1)
    let needsUpdate = false

    for (let i = 0; i < this.count; i++) {
      if (this.updateParticle(i, safeDt)) {
        needsUpdate = true
      }
    }
    if (needsUpdate) {
      this.instancedMesh.instanceMatrix.needsUpdate = true
    }
  }
}
