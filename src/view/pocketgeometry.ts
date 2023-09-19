import { Vector3 } from "three"
import { Knuckle } from "../model/physics/knuckle"
import { Pocket } from "../model/physics/pocket"
import { TableGeometry } from "./tablegeometry"

// NW 1.05 Qn{x: -22.3, y: 11.3, z: 0}
// N 1 0.9 Qn{x: 0, y: 12.0, z: 0}

export class PocketGeometry {
  static PX: number
  static PY: number
  static knuckleInset: number
  static knuckleRadius: number
  static middleKnuckleInset: number
  static middleKnuckleRadius: number
  static cornerRadius: number
  static middleRadius: number

  static pockets
  static knuckles
  static pocketCenters

  static {
    PocketGeometry.scaleToRadius(0.5)
  }

  static scaleToRadius(R) {
    PocketGeometry.PX = TableGeometry.tableX + R * (0.8 / 0.5)
    PocketGeometry.PY = TableGeometry.tableY + R * (0.8 / 0.5)
    PocketGeometry.knuckleInset = 1.6
    PocketGeometry.knuckleRadius = 0.31
    PocketGeometry.middleKnuckleInset = 1.385
    PocketGeometry.middleKnuckleRadius = 0.2
    PocketGeometry.cornerRadius = 1.1
    PocketGeometry.middleRadius = 0.9
    PocketGeometry.pocketLayout()
    PocketGeometry.enumerateCenters()
    PocketGeometry.enumerateKnuckles()
  }

  static enumerateKnuckles() {
    PocketGeometry.knuckles = [
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

  static enumerateCenters() {
    PocketGeometry.pocketCenters = [
      PocketGeometry.pockets.pocketNW.pocket,
      PocketGeometry.pockets.pocketSW.pocket,
      PocketGeometry.pockets.pocketN.pocket,
      PocketGeometry.pockets.pocketS.pocket,
      PocketGeometry.pockets.pocketNE.pocket,
      PocketGeometry.pockets.pocketSE.pocket,
    ]
  }

  static pocketLayout() {
    PocketGeometry.pockets = {
      pocketNW: {
        pocket: new Pocket(
          new Vector3(-PocketGeometry.PX, PocketGeometry.PY, 0),
          PocketGeometry.cornerRadius
        ),
        knuckleNE: new Knuckle(
          new Vector3(
            -TableGeometry.X + PocketGeometry.knuckleInset,
            TableGeometry.Y + PocketGeometry.knuckleRadius,
            0
          ),
          PocketGeometry.knuckleRadius
        ),
        knuckleSW: new Knuckle(
          new Vector3(
            -TableGeometry.X - PocketGeometry.knuckleRadius,
            TableGeometry.Y - PocketGeometry.knuckleInset,
            0
          ),
          PocketGeometry.knuckleRadius
        ),
      },
      pocketN: {
        pocket: new Pocket(
          new Vector3(0, PocketGeometry.PY + 0.7, 0),
          PocketGeometry.middleRadius
        ),
        knuckleNE: new Knuckle(
          new Vector3(
            PocketGeometry.middleKnuckleInset,
            TableGeometry.Y + PocketGeometry.middleKnuckleRadius,
            0
          ),
          PocketGeometry.middleKnuckleRadius
        ),
        knuckleNW: new Knuckle(
          new Vector3(
            -PocketGeometry.middleKnuckleInset,
            TableGeometry.Y + PocketGeometry.middleKnuckleRadius,
            0
          ),
          PocketGeometry.middleKnuckleRadius
        ),
      },
      pocketS: {
        pocket: new Pocket(
          new Vector3(0, -PocketGeometry.PY - 0.7, 0),
          PocketGeometry.middleRadius
        ),
        knuckleSE: new Knuckle(
          new Vector3(
            PocketGeometry.middleKnuckleInset,
            -TableGeometry.Y - PocketGeometry.middleKnuckleRadius,
            0
          ),
          PocketGeometry.middleKnuckleRadius
        ),
        knuckleSW: new Knuckle(
          new Vector3(
            -PocketGeometry.middleKnuckleInset,
            -TableGeometry.Y - PocketGeometry.middleKnuckleRadius,
            0
          ),
          PocketGeometry.middleKnuckleRadius
        ),
      },
      pocketNE: {
        pocket: new Pocket(
          new Vector3(PocketGeometry.PX, PocketGeometry.PY, 0),
          PocketGeometry.cornerRadius
        ),
        knuckleNW: new Knuckle(
          new Vector3(
            TableGeometry.X - PocketGeometry.knuckleInset,
            TableGeometry.Y + PocketGeometry.knuckleRadius,
            0
          ),
          PocketGeometry.knuckleRadius
        ),
        knuckleSE: new Knuckle(
          new Vector3(
            TableGeometry.X + PocketGeometry.knuckleRadius,
            TableGeometry.Y - PocketGeometry.knuckleInset,
            0
          ),
          PocketGeometry.knuckleRadius
        ),
      },
      pocketSE: {
        pocket: new Pocket(
          new Vector3(PocketGeometry.PX, -PocketGeometry.PY, 0),
          PocketGeometry.cornerRadius
        ),
        knuckleNE: new Knuckle(
          new Vector3(
            TableGeometry.X + PocketGeometry.knuckleRadius,
            -TableGeometry.Y + PocketGeometry.knuckleInset,
            0
          ),
          PocketGeometry.knuckleRadius
        ),
        knuckleSW: new Knuckle(
          new Vector3(
            TableGeometry.X - PocketGeometry.knuckleInset,
            -TableGeometry.Y - PocketGeometry.knuckleRadius,
            0
          ),
          PocketGeometry.knuckleRadius
        ),
      },
      pocketSW: {
        pocket: new Pocket(
          new Vector3(-PocketGeometry.PX, -PocketGeometry.PY, 0),
          PocketGeometry.cornerRadius
        ),
        knuckleSE: new Knuckle(
          new Vector3(
            -TableGeometry.X + PocketGeometry.knuckleInset,
            -TableGeometry.Y - PocketGeometry.knuckleRadius,
            0
          ),
          PocketGeometry.knuckleRadius
        ),
        knuckleNW: new Knuckle(
          new Vector3(
            -TableGeometry.X - PocketGeometry.knuckleRadius,
            -TableGeometry.Y + PocketGeometry.knuckleInset,
            0
          ),
          PocketGeometry.knuckleRadius
        ),
      },
    }
  }
}
