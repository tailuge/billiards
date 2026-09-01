import {
  BufferAttribute,
  BufferGeometry,
  Color,
  Group,
  Mesh,
  MeshLambertMaterial,
  PlaneGeometry,
} from "three"
import { TableGeometry } from "./tablegeometry"
import { Session } from "../network/client/session"

/**
 * Procedural, low-poly room that replaces dist/models/background.gltf. It is
 * sized so there is roughly 2m of clearance between the table edge and each
 * wall, with a checkerboard tiled floor, a hole under the table, and one
 * pastel colour per wall.
 */
export class Room {
  private static readonly clearance = 2
  private static readonly floorZ = -0.75
  private static readonly wallHeight = 4

  private static readonly floorColors = [0xe6e2d8, 0xd4cfc3]
  private static readonly wallColors = [0xf2c9c9, 0xc9d6f2, 0xcdeccd, 0xf2e8c9]
  private static readonly tournamentFloorColors = [0x000000, 0x003b3b]
  private static readonly tournamentWallColor = 0x000000

  // Wall-plane distances from the room centre, computed once at construction
  // from the already-configured table geometry so the room (and anything
  // hanging on its walls) tracks the current table size.
  readonly xWall: number
  readonly yWall: number

  private readonly tile: number
  private readonly cols: number
  private readonly rows: number

  constructor() {
    // Square tile ~= 1/3 of the table's short side, so the table footprint is
    // exactly 6 tiles long (X) by 3 tiles wide (Y).
    this.tile = TableGeometry.X / 3
    // Whole tiles from the centre line to each X wall. The 6-tile footprint is
    // even, so a tile boundary sits on the centre line.
    this.cols = Math.round((TableGeometry.X + Room.clearance) / this.tile)
    // Whole tiles across half the Y axis. The 3-tile footprint is odd, so a
    // tile is centred on the centre line and the walls land on a half-tile edge.
    this.rows = Math.round((TableGeometry.Y + Room.clearance) / this.tile - 0.5)
    this.xWall = this.cols * this.tile
    this.yWall = (this.rows + 0.5) * this.tile
  }

  generateRoom(): Group {
    const room = new Group()
    this.addFloor(room)
    this.addWalls(room)
    return room
  }

  private addFloor(room: Group) {
    // Merge every surviving tile into a single indexed geometry with per-vertex
    // colours, so the whole checkerboard floor is one mesh and one draw call
    // (instead of one mesh per tile). The hole under the table is kept to avoid
    // shading fragments the table will cover anyway.
    const positions: number[] = []
    const colors: number[] = []
    const normals: number[] = []
    const indices: number[] = []
    const color = new Color()
    const floorColors = Session.getInstance().tournamentId
      ? Room.tournamentFloorColors
      : Room.floorColors
    const half = this.tile / 2

    for (let i = -this.cols; i < this.cols; i++) {
      const x = (i + 0.5) * this.tile
      for (let j = -this.rows; j <= this.rows; j++) {
        const y = j * this.tile
        if (Math.abs(x) < TableGeometry.X && Math.abs(y) < TableGeometry.Y) {
          continue // hole under the table
        }
        color.setHex(floorColors[Math.abs(i + j) % 2])
        const base = positions.length / 3
        // Four corners of the tile, counter-clockwise viewed from +Z.
        positions.push(
          x - half,
          y - half,
          Room.floorZ,
          x + half,
          y - half,
          Room.floorZ,
          x + half,
          y + half,
          Room.floorZ,
          x - half,
          y + half,
          Room.floorZ
        )
        for (let k = 0; k < 4; k++) {
          colors.push(color.r, color.g, color.b)
          normals.push(0, 0, 1)
        }
        indices.push(base, base + 1, base + 2, base, base + 2, base + 3)
      }
    }

    const geometry = new BufferGeometry()
    geometry.setAttribute(
      "position",
      new BufferAttribute(new Float32Array(positions), 3)
    )
    geometry.setAttribute(
      "color",
      new BufferAttribute(new Float32Array(colors), 3)
    )
    geometry.setAttribute(
      "normal",
      new BufferAttribute(new Float32Array(normals), 3)
    )
    geometry.setIndex(indices)
    geometry.computeBoundingSphere()

    const mesh = new Mesh(
      geometry,
      new MeshLambertMaterial({ vertexColors: true })
    )
    room.add(mesh)
  }

  private addWalls(room: Group) {
    const z = Room.floorZ + Room.wallHeight / 2
    // Each wall is a single-sided plane whose front face (its +Z normal after
    // rotation) points inward. For the ±X walls the plane's width axis ends up
    // vertical, so the geometry args are (wallHeight, horizontal extent).
    const walls = [
      {
        x: -this.xWall,
        y: 0,
        w: Room.wallHeight,
        h: 2 * this.yWall,
        rx: 0,
        ry: Math.PI / 2,
        color: Session.getInstance().tournamentId
          ? Room.tournamentWallColor
          : Room.wallColors[0],
      },
      {
        x: this.xWall,
        y: 0,
        w: Room.wallHeight,
        h: 2 * this.yWall,
        rx: 0,
        ry: -Math.PI / 2,
        color: Session.getInstance().tournamentId
          ? Room.tournamentWallColor
          : Room.wallColors[1],
      },
      {
        x: 0,
        y: -this.yWall,
        w: 2 * this.xWall,
        h: Room.wallHeight,
        rx: -Math.PI / 2,
        ry: 0,
        color: Session.getInstance().tournamentId
          ? Room.tournamentWallColor
          : Room.wallColors[2],
      },
      {
        x: 0,
        y: this.yWall,
        w: 2 * this.xWall,
        h: Room.wallHeight,
        rx: Math.PI / 2,
        ry: 0,
        color: Session.getInstance().tournamentId
          ? Room.tournamentWallColor
          : Room.wallColors[3],
      },
    ]
    for (const wall of walls) {
      const mesh = new Mesh(
        new PlaneGeometry(wall.w, wall.h),
        new MeshLambertMaterial({ color: wall.color })
      )
      mesh.rotation.set(wall.rx, wall.ry, 0)
      mesh.position.set(wall.x, wall.y, z)
      room.add(mesh)
    }
  }
}
