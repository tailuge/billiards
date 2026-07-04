import { R, mu, setmu } from "../model/physics/constants"

export class TableGeometry {
  static tableX: number
  static tableY: number
  static X: number
  static Y: number
  static hasPockets: boolean = true

  static {
    TableGeometry.scaleToRadius(R)
  }

  static scaleToRadius(R) {
    TableGeometry.tableX = R * 43
    TableGeometry.tableY = R * 21
    TableGeometry.X = TableGeometry.tableX + R
    TableGeometry.Y = TableGeometry.tableY + R
  }

  static configureForRule(ruleType: string): void {
    if (ruleType === "threecushion") {
      const UMB_TABLE_X = 92.36
      const UMB_TABLE_Y = 46.18
      TableGeometry.tableX = R * (UMB_TABLE_X / 2 - 1)
      TableGeometry.tableY = R * (UMB_TABLE_Y / 2 - 1)
      TableGeometry.hasPockets = false
    } else {
      TableGeometry.tableX = R * 43
      TableGeometry.tableY = R * 21
      TableGeometry.hasPockets = true
      setmu(mu * 1.3)

    }
    TableGeometry.X = TableGeometry.tableX + R
    TableGeometry.Y = TableGeometry.tableY + R
  }
}
