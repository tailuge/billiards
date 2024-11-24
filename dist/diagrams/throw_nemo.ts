import { Vector3, upCross } from 'three';
import { I, m, R, mu } from './constants';

class Ball {
  readonly pos: Vector3;
  readonly vel: Vector3; // motion always in z=0 plane
  readonly rvel: Vector3; // angular velocity about any axis
}

class Collision {
  private static updateVelocities(a: Ball, b: Ball, phi: number) {
    const ab = b.pos.clone().sub(a.pos).normalize();
    const abTangent = upCross(ab);

    // Relative velocity at the contact point
    const vRel = a.vel.clone().sub(b.vel).add(R * a.rvel.clone().cross(ab).sub(b.rvel.clone().cross(ab)));

    // Normal and tangent components of relative velocity
    const vT = Math.min(mu * vRel.length(), a.vel.dot(ab)) * abTangent;
    const vN = a.vel.dot(ab) * ab;

    // Throw angle
    const thetaThrow = Math.atan2(vT.length(), vN.length());

    // Update object ball's velocity
    b.vel.copy(vN.clone().add(vT).sub(a.vel));
    b.rvel.copy(a.rvel.clone().sub(b.rvel).add(upCross(b.pos.clone().sub(a.pos), vT)));

    // Update cue ball's velocity (assuming no spin transfer for simplicity)
    a.vel.copy(a.vel.clone().sub(vN).add(vT));
  }
}