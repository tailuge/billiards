import { Vector3 } from "three"
import { Knuckle } from "../model/physics/knuckle"
import { Pocket } from "../model/physics/pocket"
import { TableGeometry } from "./tablegeometry"
import { R } from "../model/physics/constants"

// NW 1.05 Qn{x: -22.3, y: 11.3, z: 0}
// N 1 0.9 Qn{x: 0, y: 12.0, z: 0}

export class PocketGeometry {
  static readonly PX = TableGeometry.tableX + R * (0.8 / 0.5)
  static readonly PY = TableGeometry.tableY + R * (0.8 / 0.5)
  static readonly knuckleInset = (R * 1.6) / 0.5
  static readonly knuckleRadius = (R * 0.31) / 0.5
  static readonly middleKnuckleInset = (R * 1.385) / 0.5
  static readonly middleKnuckleRadius = (R * 0.2) / 0.5
  static readonly cornerRadius = (R * 1.1) / 0.5
  static readonly middleRadius = (R * 0.9) / 0.5

  static readonly pockets: { [key: string]: any } = PocketGeometry.pocketLayout(R)
  static readonly knuckles: Knuckle[] = PocketGeometry.enumerateKnuckles()
  static readonly pocketCenters: Pocket[] = PocketGeometry.enumerateCenters()

  private static pocketLayout(r) {
    const px = PocketGeometry.PX
    const py = PocketGeometry.PY
    const cornerRadius = PocketGeometry.cornerRadius
    const middleRadius = PocketGeometry.middleRadius
    const knuckleInset = PocketGeometry.knuckleInset
    const knuckleRadius = PocketGeometry.knuckleRadius
    const middleKnuckleInset = PocketGeometry.middleKnuckleInset
    const middleKnuckleRadius = PocketGeometry.middleKnuckleRadius

    return {
      pocketNW: {
        pocket: new Pocket(new Vector3(-px, py, 0), cornerRadius),
        knuckleNE: new Knuckle(
          new Vector3(
            -TableGeometry.X + knuckleInset,
            TableGeometry.Y + knuckleRadius,
            0
          ),
          knuckleRadius
        ),
        knuckleSW: new Knuckle(
          new Vector3(
            -TableGeometry.X - knuckleRadius,
            TableGeometry.Y - knuckleInset,
            0
          ),
          knuckleRadius
        ),
      },
      pocketN: {
        pocket: new Pocket(new Vector3(0, py + (r * 0.7) / 0.5, 0), middleRadius),
        knuckleNE: new Knuckle(
          new Vector3(
            middleKnuckleInset,
            TableGeometry.Y + middleKnuckleRadius,
            0
          ),
          middleKnuckleRadius
        ),
        knuckleNW: new Knuckle(
          new Vector3(
            -middleKnuckleInset,
            TableGeometry.Y + middleKnuckleRadius,
            0
          ),
          middleKnuckleRadius
        ),
      },
      pocketS: {
        pocket: new Pocket(new Vector3(0, -py - (r * 0.7) / 0.5, 0), middleRadius),
        knuckleSE: new Knuckle(
          new Vector3(
            middleKnuckleInset,
            -TableGeometry.Y - middleKnuckleRadius,
            0
          ),
          middleKnuckleRadius
        ),
        knuckleSW: new Knuckle(
          new Vector3(
            -middleKnuckleInset,
            -TableGeometry.Y - middleKnuckleRadius,
            0
          ),
          middleKnuckleRadius
        ),
      },
      pocketNE: {
        pocket: new Pocket(new Vector3(px, py, 0), cornerRadius),
        knuckleNW: new Knuckle(
          new Vector3(
            TableGeometry.X - knuckleInset,
            TableGeometry.Y + knuckleRadius,
            0
          ),
          knuckleRadius
        ),
        knuckleSE: new Knuckle(
          new Vector3(
            TableGeometry.X + knuckleRadius,
            TableGeometry.Y - knuckleInset,
            0
          ),
          knuckleRadius
        ),
      },
      pocketSE: {
        pocket: new Pocket(new Vector3(px, -py, 0), cornerRadius),
        knuckleNE: new Knuckle(
          new Vector3(
            TableGeometry.X + knuckleRadius,
            -TableGeometry.Y + knuckleInset,
            0
          ),
          knuckleRadius
        ),
        knuckleSW: new Knuckle(
          new Vector3(
            TableGeometry.X - knuckleInset,
            -TableGeometry.Y - knuckleRadius,
            0
          ),
          knuckleRadius
        ),
      },
      pocketSW: {
        pocket: new Pocket(new Vector3(-px, -py, 0), cornerRadius),
        knuckleSE: new Knuckle(
          new Vector3(
            -TableGeometry.X + knuckleInset,
            -TableGeometry.Y - knuckleRadius,
            0
          ),
          knuckleRadius
        ),
        knuckleNW: new Knuckle(
          new Vector3(
            -TableGeometry.X - knuckleRadius,
            -TableGeometry.Y + knuckleInset,
            0
          ),
          knuckleRadius
        ),
      },
    }
  }

  private static enumerateKnuckles() {
    return [
      PocketGeometry.pockets.pocketNW.knuckleNE,
      PocketGeometry.pockets.pocketNW.knuckleSW,
      PocketGeometry.pockets.pocketN.knuckleNW,
      PocketGeometry.pockets.pocketN.knuckleNE,
      PocketGeometry.pockets.pocketS.knuckleSW,
      PocketGeometry.pockets.pocketS.knuckleSE,
      PocketGeometry.pockets.pocketNE.knuckleNW,
      PocketGeometry.pockets.pocketNE.knuckleSE,
      PocketGeometry.pockets.pocketSE.knuckleNE,
      PocketGeometry.pockets.pocketSE.knuckleSW,
      PocketGeometry.pockets.pocketSW.knuckleSE,
      PocketGeometry.pockets.pocketSW.knuckleNW,
    ]
  }

  private static enumerateCenters() {
    return [
      PocketGeometry.pockets.pocketNW.pocket,
      PocketGeometry.pockets.pocketSW.pocket,
      PocketGeometry.pockets.pocketN.pocket,
      PocketGeometry.pockets.pocketS.pocket,
      PocketGeometry.pockets.pocketNE.pocket,
      PocketGeometry.pockets.pocketSE.pocket,
    ]
  }
}
