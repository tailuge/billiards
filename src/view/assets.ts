import { Mesh } from "three"
import { FontLoader, Font } from "three/examples/jsm/loaders/FontLoader"
import { RuleFactory } from "../controller/rules/rulefactory"
import { importGltf } from "../utils/gltf"
import { Rules } from "../controller/rules/rules"
import { Sound } from "./sound"
import { TableMesh } from "./tablemesh"
import { TableGeometry } from "./tablegeometry"

export class Assets {
  static font: Font | null = null
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
    const fontLoader = new FontLoader()
    fontLoader.load(
      "https://threejs.org/examples/fonts/helvetiker_regular.typeface.json",
      (font) => {
        Assets.font = font
        this.done()
      },
      undefined,
      (err) => {
        console.error("Font loading failed", err)
        this.done()
      }
    )
    importGltf("models/background.gltf", (m) => {
      this.background = m.scene
      this.done()
    })
    importGltf(this.rules.asset, (m) => {
      this.table = m.scene
      TableMesh.mesh = m.scene.children[0]
      this.done()
    })
  }

  createLocal() {
    this.sound = new Sound(false)
    TableMesh.mesh = new TableMesh().generateTable(TableGeometry.hasPockets)
    this.table = TableMesh.mesh
    // For local assets (tests/diagrams), we can try to load the font synchronously if possible or just use a placeholder
    // But FontLoader is async. To keep it simple for now, we'll try to load it.
    if (typeof Request !== "undefined" && !Assets.font) {
      const fontLoader = new FontLoader()
      fontLoader.load(
        "https://threejs.org/examples/fonts/helvetiker_regular.typeface.json",
        (font) => {
          Assets.font = font
        }
      )
    }
  }

  static localAssets(ruletype = "") {
    const assets = new Assets(ruletype)
    assets.createLocal()
    return assets
  }

  private done() {
    if (this.background && this.table && Assets.font) {
      this.ready()
    }
  }
}
