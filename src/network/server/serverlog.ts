export class ServerLog {
  static record = ""
  static enable = false
  static log(text: string) {
    ServerLog.enable && console.log(text)
    const formatted = `${new Date().toISOString()} ${text}`
    ServerLog.record += `${formatted}\n`
  }
}
