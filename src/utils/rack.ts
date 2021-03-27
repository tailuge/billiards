import { Ball } from "../model/ball"
import { TableGeometry } from "../view/tablegeometry"
import { Vector3 } from "three"
import { roundVec } from "./utils"

export class Rack {
  static readonly noise = 0.02
  static readonly gap = 1.0 + 2 * Rack.noise
  static readonly up = new Vector3(0, 0, -1)

  private static jitter(pos) {
    return roundVec(
      pos
        .clone()
        .add(
          new Vector3(
            Rack.noise * (Math.random() - 0.5),
            Rack.noise * (Math.random() - 0.5),
            0
          )
        )
    )
  }

  static cueBall() {
    return new Ball(new Vector3(-11, 0.0, 0), 0xeeeeee)
  }

  static diamond() {
    let across = new Vector3(0, Rack.gap, 0)
    let diagonal = across.clone().applyAxisAngle(Rack.up, (Math.PI * 1) / 3)
    let pos = new Vector3(TableGeometry.tableX / 2, 0, 0)
    let diamond: Ball[] = []
    diamond.push(Rack.cueBall())
    diamond.push(new Ball(Rack.jitter(pos)))
    pos.add(diagonal)
    diamond.push(new Ball(Rack.jitter(pos)))
    pos.sub(across)
    diamond.push(new Ball(Rack.jitter(pos)))
    pos.add(diagonal)
    diamond.push(new Ball(Rack.jitter(pos)))
    pos.sub(across)
    diamond.push(new Ball(Rack.jitter(pos)))
    pos.addScaledVector(across, 2)
    diamond.push(new Ball(Rack.jitter(pos)))
    pos.add(diagonal).sub(across)
    diamond.push(new Ball(Rack.jitter(pos)))
    pos.sub(across)
    diamond.push(new Ball(Rack.jitter(pos)))
    pos.add(diagonal)
    diamond.push(new Ball(Rack.jitter(pos)))
    return diamond
  }
}
