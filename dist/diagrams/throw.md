
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

More generally the relative velocity at the contact point of balls `a` and `b` is

```math
V_r = (v_a - v_b) + R(ω_b - ω_a) \times n
```
*   `n` is a 2D unit vector pointing from the center of ball `a` to the center of ball `b` at the point of contact.

```math

F_n =  m(1+e) * Δv_n
```


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
