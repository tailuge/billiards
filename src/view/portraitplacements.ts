import { Vector3 } from "three"
import { PortraitOrientation } from "./portrait"

// Portrait tuning: uniform scale, a small inward inset so the overlay clears
// the wall face (avoids clipping behind the wall), and a height just above the
// table.
export const PORTRAIT_SCALE = 0.9
export const PORTRAIT_INSET = 0.97
export const PORTRAIT_Z = 0.45

export interface PortraitPlacement {
  position: Vector3
  orientation: PortraitOrientation
}

// −X wall: inward normal points +X (toward the room centre).
export function minusXWall(wallX: number): PortraitPlacement {
  return {
    position: new Vector3(-wallX * PORTRAIT_INSET, 0, PORTRAIT_Z),
    orientation: { normal: new Vector3(1, 0, 0), up: new Vector3(0, 0, 1) },
  }
}

// +X wall: inward normal points −X (toward the room centre).
export function plusXWall(wallX: number): PortraitPlacement {
  return {
    position: new Vector3(wallX * PORTRAIT_INSET, 0, PORTRAIT_Z),
    orientation: { normal: new Vector3(-1, 0, 0), up: new Vector3(0, 0, 1) },
  }
}
