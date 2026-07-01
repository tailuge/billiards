import { Table } from "../model/table"

export interface ShotSnapshot {
  init: string
  shot: string
}

export class ExportUtils {
  static captureSnapshot(table: Table): ShotSnapshot {
    const init = JSON.stringify(table.shortSerialise())
    const aim = table.cue!.aim
    const shot = JSON.stringify({
      cueBallId: aim.i,
      angle: aim.angle,
      power: aim.power,
      offset: { x: aim.offset.x, y: aim.offset.y },
      elevation: aim.elevation || 0,
    })
    return { init, shot }
  }

  static getExportUrl(
    isAnalysis: boolean,
    rulename: string,
    init: string,
    shot: string
  ): string {
    const base = isAnalysis
      ? "https://velikodimov.github.io/billiards/dist/index.html"
      : "diagrams/export.html"
    const params = new URLSearchParams()
    params.set("ruletype", rulename)
    if (isAnalysis) {
      params.set("practice", "")
      params.set("analysis", "")
    }
    params.set("init", init)
    params.set("initShot", shot)
    return `${base}?${params.toString()}`
  }
}
