import { Ball } from "./ball"
import { Vector3 } from "three"

export class Rack {
  static readonly noise = 0.01
  static readonly gap = 1.0 + 2 * Rack.noise
  static readonly up = new Vector3(0, 0, -1)

  private static jitter(pos) {
    return pos
      .clone()
      .add(
        new Vector3(
          Rack.noise * (Math.random() - 0.5),
          Rack.noise * (Math.random() - 0.5),
          0
        )
      )
  }

  static diamond() {
    let across = new Vector3(0, Rack.gap, 0)
    let diagonal = across.clone().applyAxisAngle(Rack.up, (Math.PI * 1) / 3)
    let pos = new Vector3()
    let diamond: Ball[] = []
    diamond.push(new Ball(Rack.jitter(pos)))
    pos.add(diagonal)
    diamond.push(new Ball(Rack.jitter(pos)))
    pos.sub(across)
    diamond.push(new Ball(Rack.jitter(pos)))
    pos.add(diagonal)
    diamond.push(new Ball(Rack.jitter(pos)))
    pos.sub(across)
    diamond.push(new Ball(Rack.jitter(pos)))
    pos.add(across)
    pos.add(across)
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
