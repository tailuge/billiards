import { expect } from "chai"
import { AimEvent } from "../../src/events/aimevent"
import { Ball } from "../../src/model/ball"
import { Table } from "../../src/model/table"
import { Rack } from "../../src/utils/rack"

const shot5StartState = [
  -1.346205711364746, 0.2614285349845886, -1.4470384120941162,
  -0.7509639859199524, 0.24560047686100006, -0.05871790274977684,
  -0.9272850751876831, -0.1096646636724472, 0.011717895977199078,
  -0.7846896648406982, 0.8180956840515137, -0.6266915202140808,
  -1.4338274002075195, 0.7689780592918396, 1.4586023092269897,
  -0.7253769636154175, 0.8834645748138428, 0.6145361661911011,
  0.7774505019187927, -0.09820795804262161,
]

const shot5Aim = {
  type: "AIM",
  offset: {
    x: 0.16869300603866577,
    y: 0.24807794392108917,
    z: 0,
  },
  angle: 0.15639346837997437,
  power: 1.309999942779541,
  pos: {
    x: -1.346205711364746,
    y: 0.2614285349845886,
    z: 0,
  },
  i: 0,
}

const remoteShot6StartState = [
  -0.0652952715754509, 0.20230291783809662, -1.4470384120941162,
  -0.7509639859199524, 0.24560047686100006, -0.05871790274977684,
  -0.9272850751876831, -0.1096646636724472, 0.011717895977199078,
  -0.7846896648406982, 0.8180956840515137, -0.6266915202140808,
  -1.4338274002075195, 0.7689780592918396, 1.4586023092269897,
  -0.7253769636154175, 1.4317225217819214, 0.7596760988235474,
  0.7774505019187927, -0.09820795804262161,
]

const localShot6StartState = [
  -0.0652952715754509, 0.20230291783809662, -1.4470384120941162,
  -0.7509639859199524, 0.24560047686100006, -0.05871790274977684,
  -0.9272850751876831, -0.1096646636724472, 0.011717895977199078,
  -0.7846896648406982, 0.8180956840515137, -0.6266915202140808,
  -1.439072847366333, 0.7633445262908936, 1.4586023092269897,
  -0.7253769636154175, 1.4317225217819214, 0.7596760988235474,
  0.7774505019187927, -0.09820795804262161,
]

function replayShot(startState: number[], aimJson: Record<string, unknown>) {
  Ball.id = 0

  const table = new Table(Rack.diamond())
  table.updateFromShortSerialised(startState)
  table.cue.aim = AimEvent.fromJson(aimJson)
  table.cueball = table.balls[Number(aimJson.i ?? 0)]
  table.hit()

  const maxIterations = 200000
  let iterations = 0
  while (!table.allStationary() && iterations < maxIterations) {
    table.advance(0.001953125)
    iterations++
  }

  if (!table.allStationary()) {
    throw new Error(`Replay did not settle after ${maxIterations} steps`)
  }

  return {
    iterations,
    state: table.shortSerialise(),
  }
}

function differingBallIndexes(a: number[], b: number[]) {
  const differing = new Set<number>()
  const length = Math.max(a.length, b.length)

  for (let i = 0; i < length; i++) {
    if (a[i] !== b[i]) {
      differing.add(Math.floor(i / 2))
    }
  }

  return [...differing]
}

function ballState(state: number[], ballIndex: number) {
  return state.slice(ballIndex * 2, ballIndex * 2 + 2)
}

describe("Advance Exception Repro", () => {
  it("replays shot 5 with ball 6 landing on the local shot 6 position", () => {
    const replay = replayShot(shot5StartState, shot5Aim)

    expect(replay.iterations).to.be.greaterThan(0)
    expect(replay.state).to.not.deep.equal(localShot6StartState)
    expect(replay.state).to.not.deep.equal(remoteShot6StartState)
    expect(
      differingBallIndexes(remoteShot6StartState, localShot6StartState)
    ).to.deep.equal([6])
    expect(ballState(replay.state, 6)).to.deep.equal(
      ballState(localShot6StartState, 6)
    )
    expect(ballState(replay.state, 6)).to.not.deep.equal(
      ballState(remoteShot6StartState, 6)
    )
  })
})
