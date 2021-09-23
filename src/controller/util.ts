import { Aim } from "./aim"
import { WatchAim } from "./watchaim"
import { Init } from "./init"
import { PlayShot } from "./playshot"
import { WatchShot } from "./watchshot"
import { Replay } from "./replay"
import { End } from "./end"
import { PlaceBall } from "./placeball"

export function controllerName(c): string {
  if (c instanceof Init) {
    return "Init"
  }
  if (c instanceof PlaceBall) {
    return "PlaceBall"
  }
  if (c instanceof Aim) {
    return "Aim"
  }
  if (c instanceof WatchAim) {
    return "WatchAim"
  }
  if (c instanceof PlayShot) {
    return "PlayShot"
  }
  if (c instanceof WatchShot) {
    return "WatchShot"
  }
  if (c instanceof Replay) {
    return "Replay"
  }
  if (c instanceof End) {
    return "End"
  }
  return "UNKNOWN"
}
