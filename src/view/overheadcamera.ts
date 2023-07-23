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

  private topViewPoint = new Vector3(0, -0.1, 48)

  /**
   * Work out percentage of screen to use to get fixed aspect ratio overhead view.
   **/
  aspect(windowWidth, windowHeight) {
    const bigWidth = 500
    const smallWidth = Math.min(bigWidth, windowWidth * 0.4)
    const frameRatio = 0.59
    const cx = 1 / windowWidth
    const cy = (1 / windowHeight) * frameRatio
    if (windowHeight > 1.5 * windowWidth) {
      return { x: cx * windowWidth, y: cy * windowWidth }
    }
    if (windowWidth * 0.4 > bigWidth) {
      return { x: cx * bigWidth, y: cy * bigWidth }
    }
    return { x: cx * smallWidth, y: cy * smallWidth }
  }
}
