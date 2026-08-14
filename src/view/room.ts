import { Group, Mesh, MeshLambertMaterial, PlaneGeometry } from "three"
import { TableGeometry } from "./tablegeometry"

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
    this.cols = Math.ceil((TableGeometry.X + Room.clearance) / this.tile)
    // Whole tiles across half the Y axis. The 3-tile footprint is odd, so a
    // tile is centred on the centre line and the walls land on a half-tile edge.
    this.rows = Math.ceil((TableGeometry.Y + Room.clearance) / this.tile - 0.5)
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
    const materials = Room.floorColors.map(
      (color) => new MeshLambertMaterial({ color })
    )
    for (let i = -this.cols; i < this.cols; i++) {
      const x = (i + 0.5) * this.tile
      for (let j = -this.rows; j <= this.rows; j++) {
        const y = j * this.tile
        if (Math.abs(x) < TableGeometry.X && Math.abs(y) < TableGeometry.Y) {
          continue // hole under the table
        }
        const mesh = new Mesh(
          new PlaneGeometry(this.tile, this.tile),
          materials[Math.abs(i + j) % 2]
        )
        mesh.position.set(x, y, Room.floorZ)
        room.add(mesh)
      }
    }
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
        color: Room.wallColors[0],
      },
      {
        x: this.xWall,
        y: 0,
        w: Room.wallHeight,
        h: 2 * this.yWall,
        rx: 0,
        ry: -Math.PI / 2,
        color: Room.wallColors[1],
      },
      {
        x: 0,
        y: -this.yWall,
        w: 2 * this.xWall,
        h: Room.wallHeight,
        rx: -Math.PI / 2,
        ry: 0,
        color: Room.wallColors[2],
      },
      {
        x: 0,
        y: this.yWall,
        w: 2 * this.xWall,
        h: Room.wallHeight,
        rx: Math.PI / 2,
        ry: 0,
        color: Room.wallColors[3],
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
