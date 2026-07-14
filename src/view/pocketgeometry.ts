import { Vector3 } from "three"
import { Knuckle } from "../model/physics/knuckle"
import { Pocket } from "../model/physics/pocket"
import { TableGeometry } from "./tablegeometry"
import { R } from "../model/physics/constants"

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

  static pockets: any
  static knuckles: any
  static pocketCenters: any

  static {
    PocketGeometry.scaleToRadius(R)
    TableGeometry.registerOnConfigured(() => {
      PocketGeometry.scaleToRadius(R)
    })
  }

  static scaleToRadius(R: number) {
    const sizeScale =
      TableGeometry && TableGeometry.sizeScale !== undefined
        ? TableGeometry.sizeScale
        : 1.0
    const tableX =
      TableGeometry && TableGeometry.tableX !== undefined
        ? TableGeometry.tableX
        : R * 43
    const tableY =
      TableGeometry && TableGeometry.tableY !== undefined
        ? TableGeometry.tableY
        : R * 21

    PocketGeometry.PX = tableX + R * (0.8 / 0.5) * sizeScale
    PocketGeometry.PY = tableY + R * (0.8 / 0.5) * sizeScale
    PocketGeometry.knuckleInset = ((R * 1.6) / 0.5) * sizeScale
    PocketGeometry.knuckleRadius = ((R * 0.31) / 0.5) * sizeScale
    PocketGeometry.middleKnuckleInset = ((R * 1.385) / 0.5) * sizeScale
    PocketGeometry.middleKnuckleRadius = ((R * 0.2) / 0.5) * sizeScale
    PocketGeometry.cornerRadius = ((R * 1.1) / 0.5) * sizeScale
    PocketGeometry.middleRadius = ((R * 0.9) / 0.5) * sizeScale
    PocketGeometry.pocketLayout(R, tableX, tableY)
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

  static pocketLayout(R: number, tableX?: number, tableY?: number) {
    let tX = R * 43
    if (tableX !== undefined) {
      tX = tableX
    } else if (TableGeometry && TableGeometry.tableX !== undefined) {
      tX = TableGeometry.tableX
    }

    let tY = R * 21
    if (tableY !== undefined) {
      tY = tableY
    } else if (TableGeometry && TableGeometry.tableY !== undefined) {
      tY = TableGeometry.tableY
    }

    const X = tX + R
    const Y = tY + R

    PocketGeometry.pockets = {
      pocketNW: {
        pocket: new Pocket(
          new Vector3(-PocketGeometry.PX, PocketGeometry.PY, 0),
          PocketGeometry.cornerRadius
        ),
        knuckleNE: new Knuckle(
          new Vector3(
            -X + PocketGeometry.knuckleInset,
            Y + PocketGeometry.knuckleRadius,
            0
          ),
          PocketGeometry.knuckleRadius
        ),
        knuckleSW: new Knuckle(
          new Vector3(
            -X - PocketGeometry.knuckleRadius,
            Y - PocketGeometry.knuckleInset,
            0
          ),
          PocketGeometry.knuckleRadius
        ),
      },
      pocketN: {
        pocket: new Pocket(
          new Vector3(0, PocketGeometry.PY + (R * 0.7) / 0.5, 0),
          PocketGeometry.middleRadius
        ),
        knuckleNE: new Knuckle(
          new Vector3(
            PocketGeometry.middleKnuckleInset,
            Y + PocketGeometry.middleKnuckleRadius,
            0
          ),
          PocketGeometry.middleKnuckleRadius
        ),
        knuckleNW: new Knuckle(
          new Vector3(
            -PocketGeometry.middleKnuckleInset,
            Y + PocketGeometry.middleKnuckleRadius,
            0
          ),
          PocketGeometry.middleKnuckleRadius
        ),
      },
      pocketS: {
        pocket: new Pocket(
          new Vector3(0, -PocketGeometry.PY - (R * 0.7) / 0.5, 0),
          PocketGeometry.middleRadius
        ),
        knuckleSE: new Knuckle(
          new Vector3(
            PocketGeometry.middleKnuckleInset,
            -Y - PocketGeometry.middleKnuckleRadius,
            0
          ),
          PocketGeometry.middleKnuckleRadius
        ),
        knuckleSW: new Knuckle(
          new Vector3(
            -PocketGeometry.middleKnuckleInset,
            -Y - PocketGeometry.middleKnuckleRadius,
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
            X - PocketGeometry.knuckleInset,
            Y + PocketGeometry.knuckleRadius,
            0
          ),
          PocketGeometry.knuckleRadius
        ),
        knuckleSE: new Knuckle(
          new Vector3(
            X + PocketGeometry.knuckleRadius,
            Y - PocketGeometry.knuckleInset,
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
            X + PocketGeometry.knuckleRadius,
            -Y + PocketGeometry.knuckleInset,
            0
          ),
          PocketGeometry.knuckleRadius
        ),
        knuckleSW: new Knuckle(
          new Vector3(
            X - PocketGeometry.knuckleInset,
            -Y - PocketGeometry.knuckleRadius,
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
            -X + PocketGeometry.knuckleInset,
            -Y - PocketGeometry.knuckleRadius,
            0
          ),
          PocketGeometry.knuckleRadius
        ),
        knuckleNW: new Knuckle(
          new Vector3(
            -X - PocketGeometry.knuckleRadius,
            -Y + PocketGeometry.knuckleInset,
            0
          ),
          PocketGeometry.knuckleRadius
        ),
      },
    }
  }
}
