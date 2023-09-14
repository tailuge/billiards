import { TableInfo } from "./tableinfo"

export class Tables {
  private readonly tables: Map<string, TableInfo> = new Map()

  getTable(tableId): TableInfo {
    if (!this.tables.has(tableId)) {
      this.tables.set(tableId, new TableInfo(tableId))
    }
    return this.tables.get(tableId)!
  }
}
