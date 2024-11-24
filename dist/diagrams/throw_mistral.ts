class Ball {
    readonly pos: Vector3
    readonly vel: Vector3  // motion always in z=0 plane
    readonly rvel: Vector3  // angular velocity about any axis
  }
  
  import { I, m, R, μ } from "./constants"
  
  class Collision {
      private static updateVelocities(a: Ball, b: Ball): number {
          const ab = b.pos.clone().sub(a.pos).normalize();
          const abTangent = upCross(ab);
  
          const v_a = a.vel;
          const v_b = b.vel;
          const ω_a = a.rvel;
          const ω_b = b.rvel;
  
          const V_r = v_a.clone().sub(v_b).add(R.mul(ω_b.clone().sub(ω_a)).cross(ab));
  
          const v_t = Math.min(μ * V_r.length(), v_a.dot(abTangent));
          const v_n = v_a.dot(ab);
  
          const F_n = m * (1 + e) * v_n;
  
          const v_a_new = v_a.clone().add(ab.mul(F_n / m).add(abTangent.mul(F_n / m)));
          const v_b_new = v_b.clone().add(ab.mul(-F_n / m).add(abTangent.mul(-F_n / m)));
  
          const ω_a_new = ω_a.clone().add(ab.cross(abTangent.mul(F_n * R / I)));
          const ω_b_new = ω_b.clone().add(ab.cross(abTangent.mul(-F_n * R / I)));
  
          a.vel = v_a_new;
          a.rvel = ω_a_new;
          b.vel = v_b_new;
          b.rvel = ω_b_new;
  
          const throwAngle = Math.atan2(v_t, v_n);
          return throwAngle;
      }
  }