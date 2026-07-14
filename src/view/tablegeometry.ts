import { R, mu, setmu } from "../model/physics/constants"

function getUrlTableSize(): number | undefined {
  if (
    typeof globalThis !== "undefined" &&
    globalThis.location &&
    globalThis.location.search
  ) {
    const urlParams = new URLSearchParams(globalThis.location.search)
    const val = urlParams.get("tableSize")
    if (val) {
      const parsed = parseFloat(val)
      if (!isNaN(parsed)) return parsed
    }
  }
  return undefined
}

export class TableGeometry {
  static tableX: number
  static tableY: number
  static X: number
  static Y: number
  static hasPockets: boolean = true
  static sizeScale: number = 1.0

  static readonly DEFAULT_SIZE_POOL = 9
  static readonly DEFAULT_SIZE_THREECUSHION = 10

  static onConfiguredCallbacks: (() => void)[] = []

  static registerOnConfigured(cb: () => void) {
    TableGeometry.onConfiguredCallbacks.push(cb)
  }

  static {
    TableGeometry.scaleToRadius(R)
  }

  static scaleToRadius(R: number) {
    TableGeometry.tableX = R * 43
    TableGeometry.tableY = R * 21
    TableGeometry.X = TableGeometry.tableX + R
    TableGeometry.Y = TableGeometry.tableY + R
  }

  static configureForRule(ruleType: string, tableSize?: number): void {
    const defaultSize =
      ruleType === "threecushion"
        ? TableGeometry.DEFAULT_SIZE_THREECUSHION
        : TableGeometry.DEFAULT_SIZE_POOL
    const urlSize = getUrlTableSize()

    let size = defaultSize
    if (tableSize !== undefined) {
      size = tableSize
    } else if (urlSize !== undefined) {
      size = urlSize
    }

    const sizeScale = size / defaultSize

    TableGeometry.sizeScale = sizeScale

    if (ruleType === "threecushion") {
      const UMB_TABLE_X = 92.36
      const UMB_TABLE_Y = 46.18
      TableGeometry.tableX = R * (UMB_TABLE_X / 2 - 1) * sizeScale
      TableGeometry.tableY = R * (UMB_TABLE_Y / 2 - 1) * sizeScale
      TableGeometry.hasPockets = false
    } else {
      TableGeometry.tableX = R * 43 * sizeScale
      TableGeometry.tableY = R * 21 * sizeScale
      TableGeometry.hasPockets = true
      setmu(mu * 1.2)
    }
    TableGeometry.X = TableGeometry.tableX + R
    TableGeometry.Y = TableGeometry.tableY + R

    // Run all configured listeners
    for (const cb of TableGeometry.onConfiguredCallbacks) {
      cb()
    }
  }
}
