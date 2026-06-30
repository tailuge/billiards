import JSONCrush from "jsoncrush"

export class ReplayEncoder {
  static fullyEncodeURI(uri: string): string {
    return encodeURIComponent(uri)
      .replace(/\(/g, "%28")
      .replace(/\)/g, "%29")
      .replace(/!/g, "%21")
      .replace(/\*/g, "%2A")
  }

  static crush(data: string | any): string {
    console.time("ReplayEncoder.crush")
    try {
      let json = data
      if (typeof data !== "string") {
        console.time("ReplayEncoder.stringify")
        json = JSON.stringify(data)
        console.timeEnd("ReplayEncoder.stringify")
      }

      console.time("ReplayEncoder.JSCrush")
      const result = JSONCrush.crush(json)
      console.timeEnd("ReplayEncoder.JSCrush")
      return result
    } finally {
      console.timeEnd("ReplayEncoder.crush")
    }
  }

  static parse(s: string): any {
    console.time("ReplayEncoder.parse")
    try {
      try {
        console.time("ReplayEncoder.JSON.parse")
        return JSON.parse(s)
      } finally {
        console.timeEnd("ReplayEncoder.JSON.parse")
      }
    } catch {
      try {
        console.time("ReplayEncoder.uncrush")
        console.time("ReplayEncoder.JSONCrush.uncrush")
        const uncrushed = JSONCrush.uncrush(s)
        console.timeEnd("ReplayEncoder.JSONCrush.uncrush")

        console.time("ReplayEncoder.JSON.parseAfterUncrush")
        const result = JSON.parse(uncrushed)
        console.timeEnd("ReplayEncoder.JSON.parseAfterUncrush")
        return result
      } finally {
        console.timeEnd("ReplayEncoder.uncrush")
      }
    } finally {
      console.timeEnd("ReplayEncoder.parse")
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
