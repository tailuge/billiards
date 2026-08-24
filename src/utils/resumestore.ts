import { Session } from "../network/client/session"

/** Snapshot of a settled turn boundary, persisted for post-refresh resume. */
export interface ResumeEntry {
  tableId: string
  controller: string
  tablejson: unknown
  score: { p1: number; p2: number; b: number; active: number }
  p1type: number
  msgId?: string
}

/**
 * localStorage store for one turn-boundary snapshot per client, keyed
 * `resume.<clientId>`. No fallback handling: if storage is unavailable,
 * resume is unavailable and a fresh game starts as usual.
 */
export class ResumeStore {
  static noteMsgId(msgId?: string): void {
    if (msgId) {
      Session.getInstance().lastMsgId = msgId
    }
  }

  static save(entry: Omit<ResumeEntry, "msgId"> & { msgId?: string }): void {
    globalThis.localStorage?.setItem(
      ResumeStore.key(),
      JSON.stringify({
        ...entry,
        msgId: entry.msgId ?? Session.getInstance().lastMsgId,
      })
    )
  }

  static load(tableId: string): ResumeEntry | undefined {
    const raw = globalThis.localStorage?.getItem(ResumeStore.key())
    if (!raw) return undefined
    const entry = JSON.parse(raw) as ResumeEntry
    // Stale tab: same client started a fresh game since this entry was written
    if (entry.tableId !== tableId) return undefined
    return entry
  }

  static clear(): void {
    globalThis.localStorage?.removeItem(ResumeStore.key())
  }

  private static key(): string {
    return `resume.${Session.getInstance().clientId}`
  }
}
