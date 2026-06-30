import JSONCrush from "jsoncrush"

export class ReplayEncoder {
  static fullyEncodeURI(uri: string): string {
    return encodeURIComponent(uri)
      .replace(/\(/g, "%28")
      .replace(/\)/g, "%29")
      .replace(/!/g, "%21")
      .replace(/\*/g, "%2A")
  }

  static crush(data: string): string {
    console.log("crush start")
    const result = JSONCrush.crush(data)
    console.log("crush end")
    return result
  }

  static createState(
    init: any,
    events: any[],
    start: number = 0,
    score: number = 0,
    wholeGame: boolean = false,
    players?: { player1: string; player2: string }
  ) {
    const state: any = {
      init: init,
      shots: events,
      start: start,
      now: Date.now(),
      score: score,
      wholeGame: wholeGame,
      v: 1,
    }
    if (players) {
      state.players = players
    }
    return state
  }
}
