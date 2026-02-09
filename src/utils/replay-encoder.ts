import JSONCrush from "jsoncrush"

export class ReplayEncoder {
  static fullyEncodeURI(uri: string): string {
    return encodeURIComponent(uri)
      .replaceAll("(", "%28")
      .replaceAll(")", "%29")
      .replaceAll("!", "%21")
      .replaceAll("*", "%2A")
  }

  static crush(data: string): string {
    return JSONCrush.crush(data)
  }

  static createState(
    init: any,
    events: any[],
    start: number = 0,
    score: number = 0,
    wholeGame: boolean = false
  ) {
    return {
      init: init,
      shots: events,
      start: start,
      now: Date.now(),
      score: score,
      wholeGame: wholeGame,
      v: 1,
    }
  }
}
