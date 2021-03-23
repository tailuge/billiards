import { PerspectiveCamera, Vector3 } from "three"
import { up, zero } from "../utils/utils"

export class OverheadCamera {
  constructor(aspectRatio) {
    this.camera = new PerspectiveCamera(35, aspectRatio, 0.1, 1000)
    this.camera.position.copy(this.topViewPoint)
    this.camera.up = up
    this.camera.lookAt(zero)
  }

  camera: PerspectiveCamera

  private topViewPoint = new Vector3(0, -0.1, 29)
}
