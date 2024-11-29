import { Vector3 } from "three";
import { I, m, R, μ } from "./constants";

class Ball {
  readonly pos: Vector3;
  readonly vel: Vector3; // motion always in z=0 plane
  readonly rvel: Vector3; // angular velocity about any axis
}

class Collision {
  private static updateVelocities(a: Ball, b: Ball) {
    // Unit vector along the line of centers
    const ab = b.pos.clone().sub(a.pos).normalize();
    // Perpendicular tangent vector
    const abTangent = new Vector3(-ab.y, ab.x, 0);

    // Relative velocity at contact point
    const vRel = a.vel.clone().sub(b.vel).add(
      ab.clone().multiplyScalar(-R).cross(a.rvel).sub(
        ab.clone().multiplyScalar(R).cross(b.rvel)
      )
    );

    // Decompose relative velocity into normal and tangential components
    const vRelNormal = ab.dot(vRel);
    const vRelTangential = abTangent.dot(vRel);
        // Compute the impulse along the line of centers
        const Jn = (2 * m * vRelNormal) / (1 / m + 1 / m);

        // Compute maximum static friction force
        function computeFrictionCoefficient(v: number): number {
          const a = 0.01;
          const b = 0.108;
          const c = 1.088;
          return a + b * Math.exp(-c * v);
        }
        const μ = computeFrictionCoefficient(vRelTangential);
    
        const Ft_max = μ * Math.abs(Jn);
    
        // Compute impulse in the tangential direction considering the ft max
        const Jt = Math.min(Ft_max, Math.abs(vRelTangential)) * Math.sign(vRelTangential);
        

    const mu = Collision.computeFrictionCoefficient(vRelNormal);
    const j = (-(1 + 0.8) * vRelNormal) / (2 / m); 

    const impTangent = Math.min(mu*j,m*vRelTangential/7)
    
    // Impulse calculations
    const jNormal = -vRelNormal * (1 + 1) / (2 / m);
    const maxJTangent = μ * jNormal;
    let jTangent = -vRelTangential / (2 / m);

    // Clamp tangential impulse to Coulomb's law
    if (Math.abs(jTangent) > Math.abs(maxJTangent)) {
      jTangent = maxJTangent * Math.sign(jTangent);
    }

    // Update linear velocities
    const impulseNormal = ab.clone().multiplyScalar(jNormal);
    const impulseTangent = abTangent.clone().multiplyScalar(jTangent);
    a.vel.sub(impulseNormal.clone().add(impulseTangent).divideScalar(m));
    b.vel.add(impulseNormal.clone().add(impulseTangent).divideScalar(m));

    // Update angular velocities
    const angularImpulse = jTangent * R / I;
    a.rvel.sub(new Vector3(0, 0, angularImpulse));
    b.rvel.add(new Vector3(0, 0, angularImpulse));
  }


  private static computeFrictionCoefficient(vRel: number): number {
    const a = 0.01;
    const b = 0.108;
    const c = 1.088;
    return a + b * Math.exp(-c * vRel);
  }
}
