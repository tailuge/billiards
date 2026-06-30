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
    console.time("ReplayEncoder.crush")
    try {
      return JSONCrush.crush(data)
    } finally {
      console.timeEnd("ReplayEncoder.crush")
    }
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
