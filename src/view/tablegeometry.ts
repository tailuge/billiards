import { Vector3 } from "three"
import { Knuckle } from "../model/physics/knuckle"
import { Pocket } from "../model/physics/pocket"

// NW 1.05 Qn{x: -22.3, y: 11.3, z: 0}
// N 1 0.9 Qn{x: 0, y: 12.0, z: 0}

export class TableGeometry {
  static tableX = 21.5
  static tableY = 10.5
  static X = TableGeometry.tableX + 0.5
  static Y = TableGeometry.tableY + 0.5
  static PX = TableGeometry.tableX + 0.8
  static PY = TableGeometry.tableY + 0.8
  static knuckleInset = 1.6
  static knuckleRadius = 0.31
  static middleKnuckleInset = 1.385
  static middleKnuckleRadius = 0.2
  static cornerRadius = 1.1
  static middleRadius = 0.9

  static {
    TableGeometry.scaleToRadius(0.5)
  }

  static scaleToRadius(R) {
    TableGeometry.tableX = R*(21.5/0.5)
    TableGeometry.tableY = R*(10.5/0.5)
    TableGeometry.X = TableGeometry.tableX + R
    TableGeometry.Y = TableGeometry.tableY + R
    TableGeometry.PX = TableGeometry.tableX + 0.8
    TableGeometry.PY = TableGeometry.tableY + 0.8
    TableGeometry.knuckleInset = 1.6
    TableGeometry.knuckleRadius = 0.31
    TableGeometry.middleKnuckleInset = 1.385
    TableGeometry.middleKnuckleRadius = 0.2
    TableGeometry.cornerRadius = 1.1
    TableGeometry.middleRadius = 0.9
  }

  static readonly pockets = {
    pocketNW: {
      pocket: new Pocket(
        new Vector3(-TableGeometry.PX, TableGeometry.PY, 0),
        TableGeometry.cornerRadius
      ),
      knuckleNE: new Knuckle(
        new Vector3(
          -TableGeometry.X + TableGeometry.knuckleInset,
          TableGeometry.Y + TableGeometry.knuckleRadius,
          0
        ),
        TableGeometry.knuckleRadius
      ),
      knuckleSW: new Knuckle(
        new Vector3(
          -TableGeometry.X - TableGeometry.knuckleRadius,
          TableGeometry.Y - TableGeometry.knuckleInset,
          0
        ),
        TableGeometry.knuckleRadius
      ),
    },
    pocketN: {
      pocket: new Pocket(
        new Vector3(0, TableGeometry.PY + 0.7, 0),
        TableGeometry.middleRadius
      ),
      knuckleNE: new Knuckle(
        new Vector3(
          TableGeometry.middleKnuckleInset,
          TableGeometry.Y + TableGeometry.middleKnuckleRadius,
          0
        ),
        TableGeometry.middleKnuckleRadius
      ),
      knuckleNW: new Knuckle(
        new Vector3(
          -TableGeometry.middleKnuckleInset,
          TableGeometry.Y + TableGeometry.middleKnuckleRadius,
          0
        ),
        TableGeometry.middleKnuckleRadius
      ),
    },
    pocketS: {
      pocket: new Pocket(
        new Vector3(0, -TableGeometry.PY - 0.7, 0),
        TableGeometry.middleRadius
      ),
      knuckleSE: new Knuckle(
        new Vector3(
          TableGeometry.middleKnuckleInset,
          -TableGeometry.Y - TableGeometry.middleKnuckleRadius,
          0
        ),
        TableGeometry.middleKnuckleRadius
      ),
      knuckleSW: new Knuckle(
        new Vector3(
          -TableGeometry.middleKnuckleInset,
          -TableGeometry.Y - TableGeometry.middleKnuckleRadius,
          0
        ),
        TableGeometry.middleKnuckleRadius
      ),
    },
    pocketNE: {
      pocket: new Pocket(
        new Vector3(TableGeometry.PX, TableGeometry.PY, 0),
        TableGeometry.cornerRadius
      ),
      knuckleNW: new Knuckle(
        new Vector3(
          TableGeometry.X - TableGeometry.knuckleInset,
          TableGeometry.Y + TableGeometry.knuckleRadius,
          0
        ),
        TableGeometry.knuckleRadius
      ),
      knuckleSE: new Knuckle(
        new Vector3(
          TableGeometry.X + TableGeometry.knuckleRadius,
          TableGeometry.Y - TableGeometry.knuckleInset,
          0
        ),
        TableGeometry.knuckleRadius
      ),
    },
    pocketSE: {
      pocket: new Pocket(
        new Vector3(TableGeometry.PX, -TableGeometry.PY, 0),
        TableGeometry.cornerRadius
      ),
      knuckleNE: new Knuckle(
        new Vector3(
          TableGeometry.X + TableGeometry.knuckleRadius,
          -TableGeometry.Y + TableGeometry.knuckleInset,
          0
        ),
        TableGeometry.knuckleRadius
      ),
      knuckleSW: new Knuckle(
        new Vector3(
          TableGeometry.X - TableGeometry.knuckleInset,
          -TableGeometry.Y - TableGeometry.knuckleRadius,
          0
        ),
        TableGeometry.knuckleRadius
      ),
    },
    pocketSW: {
      pocket: new Pocket(
        new Vector3(-TableGeometry.PX, -TableGeometry.PY, 0),
        TableGeometry.cornerRadius
      ),
      knuckleSE: new Knuckle(
        new Vector3(
          -TableGeometry.X + TableGeometry.knuckleInset,
          -TableGeometry.Y - TableGeometry.knuckleRadius,
          0
        ),
        TableGeometry.knuckleRadius
      ),
      knuckleNW: new Knuckle(
        new Vector3(
          -TableGeometry.X - TableGeometry.knuckleRadius,
          -TableGeometry.Y + TableGeometry.knuckleInset,
          0
        ),
        TableGeometry.knuckleRadius
      ),
    },
  }

  static readonly knuckles = [
    TableGeometry.pockets.pocketNW.knuckleNE,
    TableGeometry.pockets.pocketNW.knuckleSW,
    TableGeometry.pockets.pocketN.knuckleNW,
    TableGeometry.pockets.pocketN.knuckleNE,
    TableGeometry.pockets.pocketS.knuckleSW,
    TableGeometry.pockets.pocketS.knuckleSE,
    TableGeometry.pockets.pocketNE.knuckleNW,
    TableGeometry.pockets.pocketNE.knuckleSE,
    TableGeometry.pockets.pocketSE.knuckleNE,
    TableGeometry.pockets.pocketSE.knuckleSW,
    TableGeometry.pockets.pocketSW.knuckleSE,
    TableGeometry.pockets.pocketSW.knuckleNW,
  ]

  static readonly pocketCenters = [
    TableGeometry.pockets.pocketNW.pocket,
    TableGeometry.pockets.pocketSW.pocket,
    TableGeometry.pockets.pocketN.pocket,
    TableGeometry.pockets.pocketS.pocket,
    TableGeometry.pockets.pocketNE.pocket,
    TableGeometry.pockets.pocketSE.pocket,
  ]
}
