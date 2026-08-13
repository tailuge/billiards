import { Vector3 } from "three"
import { PortraitOrientation } from "./portrait"

// Interior wall planes of dist/models/background.gltf after importGltf's
// R/0.5 scale: the cube node is scale (80, 40, 30) at translation (0, 0, 16),
// so X spans [-5.24, +5.24], Y [-2.62, +2.62], Z [-0.917, +3.013].
// WALL_X is inset from the true ±5.24 face (~3% total) so the overlay sits
// inside the room instead of clipping outside the wall.
export const WALL_X = 5.09

// Portrait tuning: uniform scale, a small inward offset so the overlay clears
// the wall face (avoids z-fighting), and a height just above the table.
export const PORTRAIT_SCALE = 0.9
export const PORTRAIT_OFFSET = 0.02
export const PORTRAIT_Z = 0.45

export interface PortraitPlacement {
  position: Vector3
  orientation: PortraitOrientation
}

// −X wall: inward normal points +X (toward the room centre).
export const MINUS_X_WALL: PortraitPlacement = {
  position: new Vector3(-WALL_X + PORTRAIT_OFFSET, 0, PORTRAIT_Z),
  orientation: { normal: new Vector3(1, 0, 0), up: new Vector3(0, 0, 1) },
}

// +X wall: inward normal points −X (toward the room centre).
export const PLUS_X_WALL: PortraitPlacement = {
  position: new Vector3(WALL_X - PORTRAIT_OFFSET, 0, PORTRAIT_Z),
  orientation: { normal: new Vector3(-1, 0, 0), up: new Vector3(0, 0, 1) },
}
