export class ServerLog {
  static record = ""
  static log(text: string) {
    const formatted = `${new Date().toISOString()} ${text}`
    console.log(text)
    ServerLog.record += `${formatted}\n`
  }
}
