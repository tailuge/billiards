import { Ball } from "../model/ball"
import { Outcome, OutcomeType } from "../model/outcome"
import { ProximityIndicator } from "../view/proximityindicator"
import { R } from "../model/physics/constants"

function updateCushionCount(
  outcome: Outcome[],
  cueball: Ball,
  indicator: ProximityIndicator
) {
  const cushionCount = outcome.filter(
    (o) => o.type === OutcomeType.Cushion && o.ballA === cueball
  ).length
  if (cushionCount !== indicator.cushionCount) {
    indicator.cushionCount = cushionCount
    indicator.setCushionCount(cushionCount)
  }
  if (cushionCount >= 3) {
    indicator.threeCushionsMet = true
  }
}

function updateProximityOutcome(
  outcome: Outcome[],
  cueball: Ball,
  indicator: ProximityIndicator
) {
  if (indicator.hitTarget) return
  const lastOutcome = outcome[outcome.length - 1]
  const involved = (o: Outcome) =>
    o.type === OutcomeType.Collision &&
    ((o.ballA === cueball && o.ballB === indicator.target) ||
      (o.ballB === cueball && o.ballA === indicator.target))
  if (involved(lastOutcome)) {
    indicator.hitTarget = true
    const distance = 1.99 * R
    outcome.push(Outcome.proximity(cueball, indicator.target!, distance))
    indicator.setProximity(distance)
    return
  }
  const distance = cueball.pos.distanceTo(indicator.target!.pos)
  if (distance >= 4 * R) return
  if (lastOutcome?.type !== OutcomeType.Proximity) {
    outcome.push(Outcome.proximity(cueball, indicator.target!, distance))
    indicator.setProximity(distance)
  } else if (distance < lastOutcome.incidentSpeed) {
    outcome[outcome.length - 1] = Outcome.proximity(
      cueball,
      indicator.target!,
      distance
    )
    indicator.setProximity(distance)
  }
}

function trackActiveIndicator(
  outcome: Outcome[],
  cueball: Ball,
  indicator: ProximityIndicator
) {
  if (indicator.target!.inMotion()) {
    indicator.showAt(indicator.target!.pos)
  }
  if (!indicator.threeCushionsMet) {
    updateCushionCount(outcome, cueball, indicator)
  }
  if (indicator.threeCushionsMet) {
    updateProximityOutcome(outcome, cueball, indicator)
  }
}

export function checkProximity(
  outcome: Outcome[],
  cueball: Ball,
  balls: Ball[],
  indicator: ProximityIndicator
): void {
  if (indicator.group.visible && indicator.target) {
    trackActiveIndicator(outcome, cueball, indicator)
    return
  }

  const moving = balls.filter((b) => b.inMotion())
  if (moving.length !== 2 || !moving.includes(cueball)) return

  const target = balls.find((b) => !b.inMotion() && b !== cueball)
  if (target) {
    indicator.target = target
    indicator.showAt(target.pos)
  }
}
