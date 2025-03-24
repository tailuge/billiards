export class RealPosition {
  private shots: any[]
  private BALL_DIAMETER: number = 0.0615
  private TABLE_WIDTH: number = 2.84
  private TABLE_HEIGHT: number = this.TABLE_WIDTH / 2

  constructor(shotsData: any[]) {
    this.shots = shotsData.map((shot) => this.interpolateAllBalls(shot))
  }

  private interpolateUntilMove(
    data: any,
    delta: number = 0.3,
    epsilon: number = 0.00001
  ): any {
    if (data.t.length > 1 && data.t[1] - data.t[0] > delta) {
      console.log("interpolating")
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

  public getPositionsAtTime(
    shotId: number,
    time: number
  ): { [key: string]: { x: number; y: number } } | null {
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

  public getTableDimensions(): { width: number; height: number } {
    return { width: this.TABLE_WIDTH, height: this.TABLE_HEIGHT }
  }

  public getBallDiameter(): number {
    return this.BALL_DIAMETER
  }
}
