class Ball {
    pos: Vector3
    vel: Vector3  // motion always in z=0 plane
    rvel: Vector3  // angular velocity about any axis
 }
 
 import { Vector3 } from "three"
 import { I, m, R } from "./constants"
 
 class Collision {
   private static a: number = 0.01; // Minimum friction coefficient
   private static b: number = 0.108;  // Range of friction variation
   private static c: number = 1.088;  // Decay rate
   private static e: number = 0.98; // Inelastic coefficient of friction
 
   private static dynamicFriction(vRel: number): number {
     return Collision.a + Collision.b * Math.exp(-Collision.c * vRel);
   }
   private static updateVelocities(a: Ball, b: Ball) {
     // Unit vector along the line of centers
     const n = b.pos.clone().sub(a.pos).normalize();
     // Perpendicular tangent vector
     const t = new Vector3(-n.y, n.x, 0);
 
     const vPoint = a.vel.clone().sub(b.vel).add(
       n.clone().multiplyScalar(-R).cross(a.rvel).sub(
         n.clone().multiplyScalar(R).cross(b.rvel)
       )
     );
 
     const vRelNormalMag = n.dot(vPoint);
     //vRel matches the surface relative velocity outlined in the paper
     const vRel = vPoint.addScaledVector(n, -vRelNormalMag)
     const vRelMag = vRel.length();
     const vRelTangential = t.dot(vRel); // slip velocity perpendicular to line of impact
 
     const μ = this.dynamicFriction(vRelMag);
 
     // Normal impulse component (with restitution)
     const jn = (-(1 + Collision.e) * vRelNormalMag) / (2 / m); 
 
     // Tangential impulse component (limited by friction or max change)
     const jt = Math.min(μ * jn, (2/7) * m * vRelTangential);
 
     // Impulse vector
     const j = n.clone().multiplyScalar(jn).add(vRel.clone().normalize().multiplyScalar(-jt));
 
     // Update linear velocities
     a.vel.addScaledVector(j, 1 / m);
     b.vel.addScaledVector(j, -1 / m);
 
     // Update angular velocities
     a.rvel.addScaledVector(n.clone().multiplyScalar(-R).cross(j), 1 / I);
     b.rvel.addScaledVector(n.clone().multiplyScalar(R).cross(j), 1 / I);
   }
 }