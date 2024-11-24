
Notes from https://billiards.colostate.edu/technical_proofs/new/TP_A-14.pdf
This models the throw of a ball ball collision cause by the cut angle and spin on the ball.


#### 1. Relative Velocity 

The relative sliding velocity vector between the cue ball (CB) and object ball (OB) is given as:

```math
v_{rel} = \sqrt{(v \sin(\phi) - \omega_z R)^2 + (v \cos(\phi) + \omega_x R)^2}
```

(Referenced from TP A.14, Equation 15 in the document)


#### 2. Throw Angle 
The throw angle is calculated using:

```math
\theta_{throw} = \arctan\left(\frac{v_t}{v_n}\right)
```

Where:

- $` v_t = \min(\mu \cdot v_{rel}, v \cos(\phi)) `$  
- $` v_n = v \sin(\phi) `$  

(Referenced from TP A.14, Equation 17 in the document)

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
v_{OB_t} = \frac{F_t}{m} = min(\frac{\mu v \cos(\phi)}{\sqrt{(v\sin(\phi)-R\omega_z)^2 + (R\omega_x\cos(\phi))^2}}, \frac{1}{7})(v\sin(\phi)-R\omega_z)
```

```math
v_{OB_n} = \frac{F_n}{m} = v\cos(\phi)
```

```math
\theta_{OB} = \arctan(\frac{v_{OB_t}}{v_{OB_n}})
```

```math
v_{rel} = \sqrt{(v\sin(\phi)-R\omega_z)^2+(R\omega_x\cos(\phi))^2}
```

```math
\theta_{throw}(v,\omega_x,\omega_z,\phi,\mu_m)= \arctan \Big(  \frac{ \mu_m \sqrt{ (v \sin \phi - R\omega_z)^2+ (R \omega_x \cos \phi)^2 } (v \cos \phi)}{ v \cos \phi \sqrt{ (v \sin \phi - R\omega_z)^2+ (R \omega_x \cos \phi)^2 }} \Big)
```

Equation 8 describes the relative tangential speed (sliding velocity) between the cue ball (CB) and the object ball (OB) *after* impact. It is the difference between the tangential velocity of the CB and the tangential velocity of the OB. Each ball's tangential velocity is expressed as the sum of its linear velocity and its rotational velocity multiplied by the ball's radius.

```math
v_{rel} = (v_{CB_t} - \omega_{CB}  R) - (v_{OB_t} - \omega_{OB}  R)
```

where:

* $`v_{rel}`$ is the relative tangential speed between the balls after impact.
* $`v_{CB_t}`$ is the tangential component of the cue ball's post-impact linear velocity.
* $`\omega_{CB}`$ is the cue ball's post-impact angular velocity (rotational speed).
* $`v_{OB_t}`$ is the tangential component of the object ball's post-impact linear velocity.
* $`\omega_{OB}`$ is the object ball's post-impact angular velocity.
* `R` is the radius of the balls (assumed equal).


The equation, `u(v) = a + b * exp(-c * v)`, represents a model for the coefficient of friction (µ) between the cue ball and object ball as a function of the relative tangential speed (`v`) between them. It's a decaying exponential plus a constant offset.

* **Motivation:** The author is trying to create a more realistic model for friction than a simple constant value. Real-world friction often decreases slightly at higher speeds. The data presented by Marlow in "The Physics of Pocket Billiards" suggests this kind of relationship, although the author makes some assumptions about the data from Marlow, specifically the inclusion of a sin(45 degrees) factor.
* **Equation Breakdown:**
    * `u(v)`:  The coefficient of dynamic friction at a given relative tangential speed, `v`.
    * `a`: Represents the asymptotic value of friction as the speed becomes very large. In other words, it's the minimum friction.
    * `b`: Influences the initial value of friction at low speeds. A larger `b` leads to higher friction at slower speeds.
    * `c`: Determines how quickly the friction decreases with increasing speed. Larger `c` means the decay happens faster.
    * `v`: The relative tangential speed between the cue ball and the object ball at the point of contact.

* **Best-Fit Constants:** Using the provided Marlow data and the given assumptions about that data, the author uses MathCAD's `Find` function to determine the best-fit parameters. The results are:
    * `a ≈ 0.01`
    * `b ≈ 0.108`
    * `c ≈ 1.088`

Therefore, the fitted equation for the coefficient of friction based on Marlow's data becomes:

```
u(v) = 0.01 + 0.108 * exp(-1.088 * v)
```

**Code generation prompt**

Complete the following typescript method that updates ball velocity and angular velocity assuming that balls are in contact and both may be in motion. Use concise variable names where possible even unicode is acceptable to mirror closely the equations. Succinct clean solution is best.

```typescript
class Ball {
  readonly pos: Vector3
  readonly vel: Vector3  // motion always in z=0 plane
  readonly rvel: Vector3  // angular velocity about any axis
}

import { I, m, R } from "./constants"

class Collision
    private static updateVelocities(a: Ball, b: Ball) {
        const ab = b.pos.clone().sub(a.pos).normalize();
        const abTangent = upCross(ab)
        ... 
```
