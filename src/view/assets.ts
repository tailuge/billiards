import {
  Mesh,
  TextureLoader,
  RepeatWrapping,
  Float32BufferAttribute,
  BufferGeometry,
  Group,
} from "three"
import { RuleFactory } from "../controller/rules/rulefactory"
import { importGltf } from "../utils/gltf"
import { Rules } from "../controller/rules/rules"
import { Sound } from "./sound"
import { TableMesh } from "./tablemesh"
import { TableGeometry } from "./tablegeometry"
import { Room } from "./room"

type TableCustomization = {
  texturePath?: string
  textureRepeatU?: number
  textureRepeatV?: number
  clothTextureColor?: number
  clothColor?: number
  cushionColor?: number
  clothshadeColor?: number
}

export class Assets {
  private static readonly tableCustomizations: Record<string, TableCustomization> = {
    threecushion: {
      texturePath: "assets/wave.jpg",
      textureRepeatU: 1,
      textureRepeatV: 2,
      clothColor: 0xdac39e,
      cushionColor: 0xba934e,
      clothshadeColor: 0x896e42,
    },
  }

  ready
  rules: Rules
  background: Group
  room: Room
  table: Mesh

  sound: Sound

  constructor(ruletype) {
    this.rules = RuleFactory.create(ruletype, null)
    this.rules.tableGeometry()
  }

  loadFromWeb(ready) {
    this.ready = ready
    this.sound = new Sound(true)
    this.room = new Room()
    this.background = this.room.generateRoom()
    importGltf(this.rules.asset, (m) => {
      this.rules.scaleTableModel?.(m.scene)
      if (this.isTableSize5()) {
        this.customizeTableScene(
          m.scene,
          Assets.tableCustomizations.threecushion
        )
      }
      this.table = m.scene
      TableMesh.mesh = m.scene.children[0]
      this.done()
    })
  }

  createLocal(withRoom = false) {
    this.sound = new Sound(false)
    TableMesh.mesh = new TableMesh().generateTable(TableGeometry.hasPockets)
    this.table = TableMesh.mesh
    if (withRoom) {
      this.room = new Room()
      this.background = this.room.generateRoom()
    }
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

  private customizeTableScene(scene, cfg: TableCustomization): void {
    // Sync pass: fix cloth UVs, recolor cushions
    scene.traverse((child) => {
      if (!child.isMesh) return
      const materials = Array.isArray(child.material)
        ? child.material
        : [child.material]
      for (const mat of materials) {
        const name = mat.name?.toLowerCase() ?? ""
        if (name.includes("clothshade")) {
          if (cfg.clothshadeColor === undefined) continue
          mat.color.set(cfg.clothshadeColor)
          mat.needsUpdate = true
        } else if (name.includes("cloth")) {
          this.fixClothUVs(child)
        } else if (name.includes("cushion")) {
          if (cfg.cushionColor === undefined) continue
          mat.color.set(cfg.cushionColor)
          mat.needsUpdate = true
        }
      }
    })

    // Async pass: load and apply cloth texture
    if (cfg.texturePath === undefined) return
    new TextureLoader().load(
      cfg.texturePath,
      (texture) => {
        texture.wrapS = texture.wrapT = RepeatWrapping
        texture.repeat.set(cfg.textureRepeatU ?? 1, cfg.textureRepeatV ?? 1)
        scene.traverse((child) => {
          if (!child.isMesh) return
          const materials = Array.isArray(child.material)
            ? child.material
            : [child.material]
          for (const mat of materials) {
            if (mat.name?.toLowerCase() === "cloth") {
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
