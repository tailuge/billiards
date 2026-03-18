import {
  CircleGeometry,
  Color,
  Euler,
  InstancedMesh,
  MeshStandardMaterial,
  Object3D,
  Scene,
  Vector3,
} from "three"

export interface SakuraParams {
  count: number
  gravity: number
  windScale: number
  rotationSpeed: number
  landChance: number
  fadeSpeed: number
  petalSize: number
  colors: number[]
}

export const SAKURA_PARAMS: SakuraParams = {
  count: 1000,
  gravity: 2.5,
  windScale: 1.0,
  rotationSpeed: 1.5,
  landChance: 0.15,
  fadeSpeed: 0.4,
  petalSize: 0.12,
  colors: [0xfff5f8, 0xffe1ec, 0xffc0cb],
}

export const TABLE_WIDTH = 10
export const TABLE_DEPTH = 20
export const TABLE_HEIGHT = 4
export const FELT_Z = TABLE_HEIGHT + 0.1

interface PetalData {
  pos: Vector3
  rot: Euler
  speed: number
  sway: number
  freq: number
  rotVel: Vector3
  isLanded: boolean
  opacity: number
}

export class Sakura {
  private readonly params: SakuraParams
  private readonly petalData: PetalData[] = []
  private readonly dummy = new Object3D()
  private readonly mesh: InstancedMesh

  private constructor(scene: Scene, params: SakuraParams) {
    this.params = params

    const geo = new CircleGeometry(this.params.petalSize, 5)
    const mat = new MeshStandardMaterial({
      side: 2,
      transparent: true,
      opacity: 0.9,
      roughness: 0.8,
    })

    this.mesh = new InstancedMesh(geo, mat, this.params.count)
    const colorObjs = this.params.colors.map((c) => new Color(c))

    for (let i = 0; i < this.params.count; i++) {
      this.resetPetal(i, true)
      this.mesh.setColorAt(i, colorObjs[i % colorObjs.length])
    }
    scene.add(this.mesh)
  }

  static create(scene: Scene, params: SakuraParams): Sakura {
    return new Sakura(scene, params)
  }

  private resetPetal(i: number, randomZ = false) {
    this.petalData[i] = {
      pos: new Vector3(
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 50,
        randomZ ? Math.random() * 25 : 15 + Math.random() * 5
      ),
      rot: new Euler(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      ),
      speed: (0.01 + Math.random() * 0.02) * this.params.gravity,
      sway: (0.01 + Math.random() * 0.02) * this.params.windScale,
      freq: 0.5 + Math.random(),
      rotVel: new Vector3(
        Math.random() * 0.03 * this.params.rotationSpeed,
        Math.random() * 0.02 * this.params.rotationSpeed,
        Math.random() * 0.01 * this.params.rotationSpeed
      ),
      isLanded: false,
      opacity: 1.0,
    }
  }

  update(delta: number) {
    const time = performance.now() * 0.001
    const step = delta * 60

    for (let i = 0; i < this.params.count; i++) {
      const p = this.petalData[i]
      this.updatePetal(p, time, step, i)
      this.dummy.position.copy(p.pos)
      this.dummy.rotation.copy(p.rot)
      this.dummy.updateMatrix()
      this.mesh.setMatrixAt(i, this.dummy.matrix)
    }
    this.mesh.instanceMatrix.needsUpdate = true
  }

  private updatePetal(p: PetalData, time: number, step: number, i: number) {
    if (p.isLanded) {
      p.opacity -= 0.0005 * this.params.fadeSpeed * step
      if (p.opacity <= 0) this.resetPetal(i)
      return
    }

    p.pos.z -= p.speed * step
    p.pos.x += Math.sin(time * p.freq + i) * p.sway * step
    p.pos.y += Math.cos(time * p.freq + i) * (p.sway * 0.5) * step

    p.rot.x += p.rotVel.x * step
    p.rot.y += p.rotVel.y * step
    p.rot.z += (p.rotVel.z + Math.sin(time + i) * 0.01) * step

    const inX = Math.abs(p.pos.x) < TABLE_WIDTH * 0.45
    const inY = Math.abs(p.pos.y) < TABLE_DEPTH * 0.45

    if (p.pos.z < FELT_Z && inX && inY) {
      if (Math.random() < this.params.landChance) {
        p.isLanded = true
        p.pos.z = FELT_Z
        p.rot.set(0, 0, Math.random() * Math.PI * 2)
      } else {
        p.pos.z = FELT_Z - 0.1
      }
    }

    if (p.pos.z < -5) this.resetPetal(i)
  }
}
