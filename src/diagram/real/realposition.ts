import { Vector3 } from "three"

export type BallPositions = { [key: string]: { x: number; y: number } }

export class RealPosition {
  private shots: any[]

  constructor(shotsData: any[]) {
    this.shots = shotsData.map((shot) => this.interpolateAllBalls(shot))
  }

  private interpolateUntilMove(
    data: any,
    delta: number = 0.3,
    epsilon: number = 0.00001
  ): any {
    if (data.t.length > 1 && data.t[1] - data.t[0] > delta) {
      data.t.splice(1, 0, data.t[1] - epsilon)
      data.x.splice(1, 0, data.x[0])
      data.y.splice(1, 0, data.y[0])
    }
    return data
  }

  private interpolateAllBalls(shot: any): any {
    shot.balls = Object.fromEntries(
      Object.entries(shot.balls).map(([num, data]) => [
        num,
        this.interpolateUntilMove(data),
      ])
    )
    return shot
  }

  public getPositionsAtTime(shotId: number, time: number): BallPositions {
    const shot = this.shots.find((s) => s.shotID === shotId)

    const ballPositions: { [key: string]: { x: number; y: number } } = {}

    const getInterpolatedPosition = (
      times: number[],
      positions: number[],
      targetTime: number
    ): number => {
      if (!times || times.length === 0) return positions[0]

      if (targetTime <= times[0]) return positions[0]
      if (targetTime >= times[times.length - 1])
        return positions[positions.length - 1]

      let lowIndex = 0
      let highIndex = times.length - 1
      while (lowIndex < highIndex - 1) {
        const midIndex = Math.floor((lowIndex + highIndex) / 2)
        if (times[midIndex] < targetTime) {
          lowIndex = midIndex
        } else {
          highIndex = midIndex
        }
      }

      const t1 = times[lowIndex]
      const t2 = times[highIndex]
      const p1 = positions[lowIndex]
      const p2 = positions[highIndex]
      const alpha = (targetTime - t1) / (t2 - t1)
      return p1 + alpha * (p2 - p1)
    }

    for (const ballNum in shot.balls) {
      const ballData = shot.balls[ballNum]
      const x = getInterpolatedPosition(ballData.t, ballData.x, time)
      const y = getInterpolatedPosition(ballData.t, ballData.y, time)
      ballPositions[ballNum] = { x: x, y: y }
    }
    return ballPositions
  }

  public realToSim(key: string, ballPositions: BallPositions) {
    return {
      x: 2.3 * (0.71 - ballPositions[key].x / 2),
      y: 2.3 * (-0.36 + ballPositions[key].y / 2),
    }
  }

  identifyFirstMover(shotData: any) {
    console.log(shotData)
    return shotData.balls["1"].t[1] < shotData.balls["2"].t[1] ? "1" : "2"
  }

  estimateDirection(shotData: any) {
    const ballPositions1 = this.getPositionsAtTime(shotData.shotID, 0)
    const ballPositions2 = this.getPositionsAtTime(shotData.shotID, 0.13)
    const firstMover = this.identifyFirstMover(shotData)
    const pos1 = new Vector3(
      ballPositions1[firstMover].x,
      ballPositions1[firstMover].y
    )
    const pos2 = new Vector3(
      ballPositions2[firstMover].x,
      ballPositions2[firstMover].y
    )
    return {
      pos1: ballPositions1,
      pos2: ballPositions2,
      firstMover: firstMover,
      angle: pos1.angleTo(pos2),
      speed: pos1.distanceTo(pos2),
    }
  }

  stateFrom(shotData: any) {
    const ballPositions = this.getPositionsAtTime(shotData.shotID, 0)
    var state: { init: number[]; shots: any[] } = {
      init: [],
      shots: [],
    }
    for (const ballNum in ballPositions) {
      const pos = this.realToSim(ballNum, ballPositions)
      state.init.push(pos.x)
      state.init.push(pos.y)
    }

    const estimatedDirection = this.estimateDirection(shotData)
    const ball = estimatedDirection.firstMover == "1" ? 0 : 1
    console.log(estimatedDirection)
    state.shots.push({
      type: "AIM",
      offset: { x: -0, y: 0, z: 0 },
      angle: estimatedDirection.angle,
      power: estimatedDirection.speed,
      pos: { x: state.init[ball * 2], y: state.init[ball * 2 + 1], z: 0 },
      i: ball,
    })
    return state
  }
}
