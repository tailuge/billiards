import { PerspectiveCamera, Vector3 } from "three";
import { up, zero } from "../utils/utils";


export class Camera {
    constructor(aspectRatio) {
        this.camera = new PerspectiveCamera(75, aspectRatio, 0.1, 1000)
    }

    camera: PerspectiveCamera
    mode = this.topView

    private topViewPoint = new Vector3(0, -0.1, 17)

    update(t) {
        this.t += t
        this.mode()
    }

    t = 0
    topView() {
        this.camera.position.lerp(this.topViewPoint, 0.1)
        this.camera.up = up
        this.camera.lookAt(zero)
    }

    aimView(cueBallPos, dir) {
        this.camera.position.lerp(
            cueBallPos.clone().addScaledVector(dir, -9),
            0.07
        )
        this.camera.position.z = 2.7
        this.camera.up = up
        this.camera.lookAt(cueBallPos)
    }

    afterHitView(cueBallPos) {
        this.camera.position.addScaledVector(up, 0.01)
        this.camera.up = up
        this.camera.lookAt(cueBallPos)
    }
}
