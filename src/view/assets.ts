import { Mesh } from "three"
import { RuleFactory } from "../controller/rules/rulefactory"
import { importGltf } from "../utils/gltf"
import { Rules } from "../controller/rules/rules"
import { Sound } from "./sound"
import { TableMesh } from "./tablemesh"
import { CueMesh } from "./cuemesh"
import { TableGeometry } from "./tablegeometry"

export class Assets {
  ready
  rules: Rules
  background: Mesh
  table: Mesh
  cue: Mesh

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
    importGltf(this.rules.asset(), (m) => {
      this.table = m.scene
      TableMesh.mesh = m.scene.children[0]
      this.done()
    })
    importGltf("models/cue.gltf", (m) => {
      this.cue = m
      CueMesh.mesh = m.scene.children[0]
      this.done()
    })
  }

  creatLocal() {
    this.sound = new Sound(false)
    TableMesh.mesh = new TableMesh().generateTable(TableGeometry.hasPockets)
    this.table = TableMesh.mesh
  }

  static localAssets(ruletype = "") {
    const assets = new Assets(ruletype)
    assets.creatLocal()
    return assets
  }

  private done() {
    if (this.background && this.table && this.cue) {
      this.ready()
    }
  }
}
