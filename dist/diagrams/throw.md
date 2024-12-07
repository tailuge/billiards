
Notes from https://billiards.colostate.edu/technical_proofs/new/TP_A-14.pdf
This models the throw of a ball ball collision caused by the cut angle and spin on the ball.




Inputs

*   `v` linear velocity of cue ball.
*    ω<sub>x</sub> top spin ω<sub>z</sub> side spin.
*   `ϕ` cut angle.
*   `R` ball radius.
*   `μ` coefficient of friction between balls


**Summary**

```math
\vec{v}_B = \vec{v} + \vec{\omega} \times \vec{r}_{B/O} = v\vec{j} + (\omega_x\vec{i} + \omega_z\vec{k}) \times R(-\sin(\phi)\vec{i} + \cos(\phi)\vec{j})
```

```math
\vec{v}_B = v_t\vec{t} + v_n\vec{n} + v_k\vec{k} = (v\sin(\phi) - R\omega_z)\vec{t} + (v\cos(\phi))\vec{n} + (R\omega_x\cos(\phi))\vec{k}
```

```math
\vec{v}_{rel} = v_B\vec{t} + v_B\vec{k} = (v\sin(\phi) - R\omega_z)\vec{t} + (R\omega_x\cos(\phi))\vec{k}
```

```math
\hat{e}_t = \frac{v_t}{v_{rel}}\vec{t} = \frac{v\sin(\phi)-R\omega_z}{\sqrt{(v\sin(\phi)-R\omega_z)^2 + (R\omega_x\cos(\phi))^2}}\vec{t}
```

```math
\hat{e}_k = \frac{v_k}{v_{rel}}\vec{k} = \frac{R\omega_x\cos(\phi)}{\sqrt{(v\sin(\phi)-R\omega_z)^2 + (R\omega_x\cos(\phi))^2}}\vec{k}
```

```math
F_n = mv\cos(\phi)
```

```math
F_{t_{max}} = \mu F_n = \frac{\mu mv \cos(\phi)(v \sin(\phi) - R\omega_z)}{\sqrt{(v \sin(\phi) - R\omega_z)^2 + (R\omega_x \cos(\phi))^2}}
```

```math
F_{t_{max}} = \frac{m}{7}(v\sin(\phi) - R\omega_z)
```

```math
v_{OB_t} = \frac{F_t}{m} = \min\left( \frac{\mu v \cos(\phi)}{\sqrt{(v\sin(\phi)-R\omega_z)^2 + (R\omega_x\cos(\phi))^2}}, \frac{1}{7} \right)(v\sin(\phi)-R\omega_z)
```

```math
v_{OB_n} = \frac{F_n}{m} = v\cos(\phi)
```

```math
\theta_{OB} = \arctan(\frac{v_{OB_t}}{v_{OB_n}})
```
### Throw Angle Formula

```math
\theta_{\text{throw}} = \arctan\left(\frac{\min\left( \frac{\mu(v_{\text{rel}}) \cdot v \cdot \cos(\phi)}{v_{\text{rel}}}, \frac{1}{7} \right) \cdot (v \sin(\phi) - R \omega_z)}{v \cos(\phi)} \right)
```
#### Where:

```math
v_{\text{rel}}(v, \omega_x, \omega_z, \phi) = \sqrt{(v \sin(\phi) - R \omega_z)^2 + ( \cos(\phi) R \omega_x)^2} 
```
```math
 \mu(v) = a + b \cdot e^{-c \cdot v} 
```




The equation, `u(v) = a + b * exp(-c * v)`, represents a model for the coefficient of friction (µ) between the cue ball and object ball as a function of the relative tangential speed (`v`) between them. It's a decaying exponential plus a constant offset.

 The data presented by Marlow in "The Physics of Pocket Billiards" suggests this kind of relationship, although the author makes some assumptions about the data from Marlow, specifically the inclusion of a sin(45 degrees) factor.
* **Equation Breakdown:**
    * `u(v)`:  The coefficient of dynamic friction at a given relative tangential speed, `v`.
    * `a`: Represents the asymptotic value of friction as the speed becomes very large. In other words, it's the minimum friction.
    * `b`: Influences the initial value of friction at low speeds. A larger `b` leads to higher friction at slower speeds.
    * `c`: Determines how quickly the friction decreases with increasing speed. Larger `c` means the decay happens faster.
    * `v`: The relative tangential speed between the cue ball and the object ball at the point of contact.

* **Best-Fit Constants:** Using the provided Marlow data and the given assumptions about that data
    * `a ≈ 0.01`
    * `b ≈ 0.108`
    * `c ≈ 1.088`

Therefore, the fitted equation for the coefficient of friction based on Marlow's data becomes:

```
u(v) = 0.01 + 0.108 * exp(-1.088 * v)
```
```typescript 
function computeFrictionCoefficient(vRel: number): number {
  const a = 0.01;
  const b = 0.108;
  const c = 1.088;
  return a + b * Math.exp(-c * vRel);
}
```
**Relative Velocity Equation**

The relative velocity  *v*<sub>rel</sub> between two colliding balls *a* and *b* is given by:

  *v*<sub>rel</sub> = (*v*<sub>a</sub> - *v*<sub>b</sub>) + [*r*<sub>a</sub> × ω<sub>a</sub>] - [*r*<sub>b</sub> × ω<sub>b</sub>]

Where:

*   *v*<sub>a</sub>, *v*<sub>b</sub>: Linear velocities of balls *a* and *b*.
*   ω<sub>a</sub>, ω<sub>b</sub>: Angular velocities of balls *a* and *b*.
*   *r*<sub>a</sub> = -*R* **n**: Vector from the center of ball *a* to the contact point.
*   *r*<sub>b</sub> = *R* **n**: Vector from the center of ball *b* to the contact point.
*   *R*: Radius of the balls.
*   **n**: Unit vector normal to the contact surface, pointing from ball *b* to ball *a*.

**Expanding the Rotational Contributions**

Expanding the cross product terms:

*   *r*<sub>a</sub> × ω<sub>a</sub> = -*R* **n** × ω<sub>a</sub>
*   *r*<sub>b</sub> × ω<sub>b</sub> =  *R* **n** × ω<sub>b</sub>

**Relative Velocity Equation**

Substituting these expansions into the relative velocity equation gives:

*v*<sub>rel</sub> = (*v*<sub>a</sub> - *v*<sub>b</sub>) - [*R* (**n** × ω<sub>a</sub>)] + [*R* (**n** × ω<sub>b</sub>)]

**Code Summary for throw angle**

The following code accurately reflects the equations for throw angle.
However it is not in the general form for two spinning balls.

```typescript
  public static R: number = 0.029; // ball radius in meters

  // Friction parameters
  private static a: number = 0.01; // Minimum friction coefficient
  private static b: number = 0.108;  // Range of friction variation
  private static c: number = 1.088;  // Decay rate


  dynamicFriction(vRel: number): number {
    return CollisionThrow.a + CollisionThrow.b * Math.exp(-CollisionThrow.c * vRel);
  }


  relativeVelocity(v: number, ωx: number, ωz: number, ϕ: number): number {
    return Math.sqrt(
      Math.pow(v * Math.sin(ϕ) - ωz * CollisionThrow.R, 2) +
      Math.pow(Math.cos(ϕ) * ωx * CollisionThrow.R, 2)
    );
  }


  throwAngle(v: number, ωx: number, ωz: number, ϕ: number): number {
    const vRel = this.relativeVelocity(v, ωx, ωz, ϕ);
    const μ = this.dynamicFriction(vRel);
    const numerator = Math.min((μ * v * Math.cos(ϕ)) / vRel, 1 / 7) * (v * Math.sin(ϕ) - CollisionThrow.R * ωz);
    const denominator = v * Math.cos(ϕ);
    return Math.atan2(numerator, denominator);
  }
```

**Code generation prompt**

Complete the following typescript method that updates ball velocity and angular velocity assuming that balls are in contact and both may be in motion with equal radius and mass. Use concise variable names where possible even unicode is acceptable to mirror closely the equations. Succinct clean modular solution is best. Remember the balls are constrained in the
2d plane z=0 and the spin axis of the balls is arbitrary 3d vector. The start of the method
is given that already computes the relative velocity of the contact point. Complete the following code with reference to the equations from this summary.

```typescript
class Ball {
   pos: Vector3
   vel: Vector3  // motion always in z=0 plane
   rvel: Vector3  // angular velocity about any axis
}

import { Vector3 } from "three"
import { I, m, R } from "./constants"

class Collision {
  private static updateVelocities(a: Ball, b: Ball) {
    // Unit vector along the line of centers
    const ab = b.pos.clone().sub(a.pos).normalize();
    // Perpendicular tangent vector
    const abTangent = new Vector3(-ab.y, ab.x, 0);


    const vPoint = a.vel.clone().sub(b.vel).add(
      ab.clone().multiplyScalar(-R).cross(a.rvel).sub(
        ab.clone().multiplyScalar(R).cross(b.rvel)
      )
    );

    const vRelNormalMag = ab.dot(vPoint);
    //vRel matches the surface relative velocity outlined in the paper
    const vRel = vPoint.addScaledVector(ab, -vRelNormalMag)
    const vRelMag = vRel.length();
    const vRelTangential = abTangent.dot(vRel); // slip velocity perpendicular to line of impact

    const μ = this.dynamicFriction(vRelMag);

    const normalImpulse = vRelNormalMag;
    const tangentialImpulse =
      Math.min((μ * vRelNormalMag) / vRelMag, 1 / 7) * (-vRelTangential)

    let throwAngle = Math.atan2(tangentialImpulse, normalImpulse)

    ...  Complete the code to update a.vel b.vel a.rvel b.rvel incorporating inelastic coefficient of friction e=0.98 ...
```
