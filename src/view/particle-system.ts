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
  tableZ: 30,
  scaleX: 1.0,
  scaleY: 1.0,
  stopThreshold: 0.5,
  gravity: -12.375,
  baseRestitution: 0.55,
  restitutionVariance: 0.35,
}

export class ParticleSystem {
  private scene: Scene
  private config: Required<ParticleSystemConfig>
  private count: number
  private pPosX: Float32Array
  private pPosY: Float32Array
  private pPosZ: Float32Array
  private pRot: Float32Array
  private pVelZ: Float32Array
  private pRotVel: Float32Array
  private pDelay: Float32Array
  private pAge: Float32Array
  private pState: Uint8Array
  private dummy: Object3D
  private stopZ: number
  private instancedMesh: InstancedMesh | null = null

  constructor(
    scene: Scene,
    sourceCanvas: HTMLCanvasElement,
    config: ParticleSystemConfig = {}
  ) {
    this.scene = scene
    this.config = { ...DEFAULT_CONFIG, ...config }

    this.count = this.config.tableWidth * this.config.tableLength
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
    this.stopZ = this.config.tableZ + 0.1

    this._init(sourceCanvas)
  }

  private _init(canvas: HTMLCanvasElement): void {
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const imgData = ctx.getImageData(
      0,
      0,
      this.config.tableWidth,
      this.config.tableLength
    ).data

    const geo = new BufferGeometry()
    const vertices = new Float32Array([-0.5, -0.5, 0, 0.5, -0.5, 0, 0, 0.5, 0])
    geo.setAttribute("position", new BufferAttribute(vertices, 3))
    geo.computeVertexNormals()

    const mat = new MeshLambertMaterial({
      side: DoubleSide,
    })

    this.instancedMesh = new InstancedMesh(geo, mat, this.count)
    this.instancedMesh.castShadow = true
    this.instancedMesh.receiveShadow = true
    this.scene.add(this.instancedMesh)

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

      this.pPosX[i] = (x - this.config.tableWidth / 2) * this.config.scaleX
      this.pPosY[i] = (this.config.tableLength / 2 - y) * this.config.scaleY
      this.pPosZ[i] = 80 + Math.random() * 50

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
    if (this.instancedMesh) {
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
    this.scene = null as unknown as Scene
  }

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
    if (!this.scene) return
    const safeDt = Math.min(dt, 0.1)
    let needsUpdate = false

    for (let i = 0; i < this.count; i++) {
      if (this.updateParticle(i, safeDt)) {
        needsUpdate = true
      }
    }

    if (needsUpdate) {
      this.instancedMesh!.instanceMatrix.needsUpdate = true
    }
  }
}
