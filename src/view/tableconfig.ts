import { TableGeometry } from "./tablegeometry"
import { PocketGeometry } from "./pocketgeometry"
import { R } from "../model/physics/constants"

/**
 * Single coordinator for table + pocket geometry configuration.
 *
 * `PocketGeometry` is derived from `TableGeometry` (pocket positions read
 * `TableGeometry.tableX/Y/X/Y`), so the two must always be (re)configured
 * together in that order. Previously every caller had to remember the paired
 * incantation; this enforces it in one spot.
 */
export class TableConfig {
  /**
   * Apply table geometry for a rule and the given tableSize, then re-derive
   * pocket geometry from the updated table dimensions.
   */
  static apply(ruleType: string, tableSize: number = 10): void {
    TableGeometry.configureForRule(ruleType, tableSize)
    PocketGeometry.scaleToRadius(R)
  }

  /**
   * Read the `tableSize` URL query parameter, defaulting to 10.
   */
  static tableSizeFromUrl(): number {
    const urlParams = new URLSearchParams(globalThis.location?.search ?? "")
    return parseFloat(urlParams.get("tableSize") || "10")
  }
}
