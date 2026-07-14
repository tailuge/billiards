import {
  Mesh,
  TextureLoader,
  RepeatWrapping,
  Float32BufferAttribute,
  BufferGeometry,
} from "three"
import { RuleFactory } from "../controller/rules/rulefactory"
import { importGltf } from "../utils/gltf"
import { Rules } from "../controller/rules/rules"
import { Sound } from "./sound"
import { TableMesh } from "./tablemesh"
import { TableGeometry } from "./tablegeometry"

export class Assets {
  private static readonly tableCustomization = {
    texturePath: "assets/cat.jpg",
    textureRepeatU: 1,
    textureRepeatV: 2,
    clothColor: 0xba934e,
    cushionColor: 0xba934e,
  }

  ready
  rules: Rules
  background: Mesh
  table: Mesh

  sound: Sound

  constructor(ruletype) {
    this.rules = RuleFactory.create(ruletype, null)
    this.rules.tableGeometry()
  }

  loadFromWeb(ready) {
    this.ready = ready
    this.sound = new Sound(true)
    importGltf("models/background.gltf", (m) => {
      this.background = m.scene
      this.done()
    })
    importGltf(this.rules.asset, (m) => {
      this.rules.scaleTableModel?.(m.scene)
      if (this.isTableSize5()) {
        this.customizeTableScene(m.scene)
      }
      this.table = m.scene
      TableMesh.mesh = m.scene.children[0]
      this.done()
    })
  }

  createLocal() {
    this.sound = new Sound(false)
    TableMesh.mesh = new TableMesh().generateTable(TableGeometry.hasPockets)
    this.table = TableMesh.mesh
  }

  static localAssets(ruletype = "") {
    const assets = new Assets(ruletype)
    assets.createLocal()
    return assets
  }

  private isTableSize5(): boolean {
    const urlParams = new URLSearchParams(globalThis.location?.search ?? "")
    return parseFloat(urlParams.get("tableSize") || "10") === 5
  }

  private customizeTableScene(scene): void {
    const cfg = Assets.tableCustomization

    // Sync pass: fix cloth UVs, recolor cushions
    scene.traverse((child) => {
      if (!child.isMesh) return
      const materials = Array.isArray(child.material)
        ? child.material
        : [child.material]
      for (const mat of materials) {
        const name = mat.name?.toLowerCase() ?? ""
        if (name.includes("cloth")) {
          this.fixClothUVs(child)
        } else if (name.includes("cushion")) {
          mat.color.set(cfg.cushionColor)
          mat.needsUpdate = true
        }
      }
    })

    // Async pass: load and apply cloth texture
    new TextureLoader().load(
      cfg.texturePath,
      (texture) => {
        texture.wrapS = texture.wrapT = RepeatWrapping
        texture.repeat.set(cfg.textureRepeatU, cfg.textureRepeatV)
        scene.traverse((child) => {
          if (!child.isMesh) return
          const materials = Array.isArray(child.material)
            ? child.material
            : [child.material]
          for (const mat of materials) {
            if (mat.name?.toLowerCase().includes("cloth")) {
              mat.map = texture
              mat.color.set(cfg.clothColor)
              mat.needsUpdate = true
            }
          }
        })
      },
      undefined,
      () => console.warn("Failed to load table cloth texture")
    )
  }

  private fixClothUVs(mesh): void {
    const geometry = mesh.geometry as BufferGeometry
    if (!geometry) return
    if (geometry.attributes.uv && !this.uvsAreCollapsed(geometry)) return
    this.generatePlanarUVs(geometry)
  }

  private uvsAreCollapsed(geometry: BufferGeometry): boolean {
    const uv = geometry.attributes.uv
    if (!uv) return false
    const u0 = uv.getX(0)
    const v0 = uv.getY(0)
    for (let i = 1; i < uv.count; i++) {
      if (uv.getX(i) !== u0 || uv.getY(i) !== v0) return false
    }
    return true
  }

  private generatePlanarUVs(geometry: BufferGeometry): void {
    const pos = geometry.attributes.position
    const count = pos.count

    let minX = Infinity,
      maxX = -Infinity
    let minY = Infinity,
      maxY = -Infinity

    for (let i = 0; i < count; i++) {
      const x = pos.getX(i)
      const y = pos.getY(i)
      if (x < minX) minX = x
      if (x > maxX) maxX = x
      if (y < minY) minY = y
      if (y > maxY) maxY = y
    }

    const rangeX = maxX - minX
    const rangeV = maxY - minY
    const scale = Math.max(rangeX, rangeV)

    const uvs = new Float32Array(count * 2)
    for (let i = 0; i < count; i++) {
      uvs[i * 2] = (pos.getX(i) - minX) / scale
      uvs[i * 2 + 1] = (pos.getY(i) - minY) / scale
    }

    geometry.setAttribute("uv", new Float32BufferAttribute(uvs, 2))
  }

  private done() {
    if (this.background && this.table) {
      this.ready()
    }
  }
}
