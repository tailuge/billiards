
# Mathaven ball cushion summary

This outlines a ball’s impact with a cushion analyzed with specific reference to the forces, velocities, and spins at play. Here's how the variables relate to the contact points I and C, as well as the velocities and spin components.

Contact Points:

* Point I: This is the primary contact point between the ball and the cushion.
* Point C: This is where the ball contacts the table surface during the collision

## Given inputs to the numerical approximation

```text
V₀: Initial velocity magnitude
α: Angle relative to cushion with 0 being parallel and pi/2 perpendicular
ω₀T: Initial topspin angular velocity along line of travel of ball
ω₀S: Initial sidespin angular velocity
```

## Initial Conditions Equations

Centroid Velocities (Linear Velocities):

```text
(ẋG)₁ = V₀ cos(α)     // Initial x velocity parallel to cushion
(ẏG)₁ = V₀ sin(α)  
(żG)₁ = 0            
```

Angular Velocities:

```text
(θ̇x)₁ = -ω₀T sin(α)   // Initial angular velocity around x-axis
(θ̇y)₁ = ω₀T cos(α)    // Initial angular velocity around y-axis
(θ̇z)₁ = ω₀S           // Initial angular velocity around z-axis (sidespin)
```
## Constants

* Coefficient of Restitution $e_e$: Value between the ball and cushion: 0.98
* Coefficient of Sliding Friction $μ_s$ : Between the ball and table surface: 0.212
* Coefficient of Sliding Friction $μ_w$ : Between the ball and cushion: 0.14
* Mass (M): 0.1406 kg
* Ball Radius (R): 26.25 mm

Cushion height in both snooker and pool, h = 7R/5, where R is the ball radius.
The common normal line Z at the contact point with the cushion makes an angle θ with the Y-axis, such that

* sinθ = 2/5 constant.
* cosθ = sqrt(21)/5 constant.

Slip Speed at Point I (cushion contact):

```text
s(0) = √[(V₀ cos(α) + R(ω₀T cos(α)sinθ - ω₀S cosθ))² + (-V₀ sin(α)sinθ - Rω₀T sin(α))²]
```

Slip Speed at Point C (table contact):

```text
s'(0) = |V₀ - Rω₀T|
```

Slip Angle at Point I:

$\Phi$(0) = tan⁻¹((-V₀ sin(α)sinθ - Rω₀T sin(α)) / (V₀ cos(α) + R(ω₀T cos(α)sinθ - ω₀S cosθ)))

Slip Angle at Point C:

$\Phi^{\prime}$(0) = α            when V₀ - Rω₀T > 0

$\Phi^{\prime}$(0) = 180° + α     when V₀ - Rω₀T < 0

undefined when V₀ = Rω₀T (rolling condition)

## Key equations

### Equation (12a): Slip velocity at cushion along the x-axis

$$
ẋ_I = ẋ_G + θ̇_y R \sin \theta - θ̇_z R \cos \theta
$$

### Equation (12b): Slip velocity at cushion along the y-axis (transformed to y')

$$
ẏ'_I = -ẏ_G \sin \theta + ż_G \cos \theta + θ̇_x R
$$

### Equation (13a): Slip velocity at table along the x-axis

$$
ẋ_C = ẋ_G - θ̇_y R
$$

### Equation (13b): Slip velocity at table along the y-axis

$$
ẏ_C = ẏ_G + θ̇_x R
$$

12/13 summarised as

* **Equation (12a):** Slip velocity at cushion along the x-axis:  `ẋᵢ = ẋɢ + θ̇ᵧ R sin θ - θ̇𝘇 R cos θ`
* **Equation (12b):** Slip velocity at cushion along the y'-axis (transformed to y'): `ẏ'ᵢ = -ẏɢ sin θ + żɢ cos θ + θ̇ₓ R`
* **Equation (13a):** Slip velocity at table along the x-axis: `ẋc = ẋɢ - θ̇ᵧ R`
* **Equation (13b):** Slip velocity at table along the y-axis:  `ẏc = ẏɢ + θ̇ₓ R`

### equation (14d): update angular velocity

$$
(θ˙x)_{n+1}−(θ˙x)_n = -\frac{5}{2MR}[\mu_w \sin(\phi) + \mu_s \sin(\phi') \times (\sin(\theta) + \mu_w \sin(\phi)\cos(\theta))]\Delta P_I
$$

### equation (14e)

$$
(θ˙y)_{n+1}−(θ˙y)_n = -\frac{5}{2MR}[\mu_w \cos(\phi)\sin(\theta) - \mu_s \cos(\phi') \times (\sin(\theta) + \mu_w \sin(\phi)\cos(\theta))]\Delta P_I
$$

### equation (14f)

$$
(θ˙z)_{n+1}−(θ˙z)_n = \frac{5}{2MR}(\mu_w \cos(\phi)\cos(\theta))\Delta P_I
$$

equations 14abc summarised as

* Δθ̇ₓ = - (5/(2MR)) [μw sin(Φ) + μs sin(Φ') (sinθ + μw sin(Φ) cosθ)] ΔPᵢ
* Δθ̇ᵧ = - (5/(2MR)) [μw cos(Φ)sinθ - μs cos(Φ') (sinθ + μw sin(Φ) cosθ)] ΔPᵢ
* Δθ̇𝘇 = (5/(2MR)) (μw cos(Φ)cosθ) ΔPᵢ


### Equation (15a): Rolling condition for the ball at the cushion when slip speed $s = 0$

$$
\Delta P_I^x = 0, \quad \Delta P_I^{y'} = 0
$$

### Equation (15b): Rolling condition for the ball at the table when slip speed $s' = 0$

$$
\Delta P_C^x = 0, \quad \Delta P_C^y = 0
$$

### Equation (16a): Work done by the normal force at contact point $I$ along the $Z'$-axis

$$
W_{Z'}^I(P_I^{(n+1)}) = W_{Z'}^I(P_I^{(n)}) + \frac{\Delta P_I}{2} \left( z'_I(P_I^{(n+1)}) + z'_I(P_I^{(n)}) \right)
$$

### Equation (17a)

$$
(ẋ_G)_{n+1} - (ẋ_G)_n = - \frac{1}{M} \left[\mu_w \cos(\phi) + \mu_s \cos(\phi') \cdot (\sin \theta + \mu_w \sin(\phi) \cos \theta)\right] \Delta P_I
$$

$$
(ẏ_G)_{n+1} - (ẏ_G)_n  = - \frac{1}{M} \left[ \cos \theta - \mu_w \sin \theta \sin \phi + \mu_s \sin \phi' \cdot \left( \sin \theta + \mu_w \sin \phi \cos \theta \right) \right] \Delta P_I
$$

* Δẋɢ = - (1/M) [μw cos(Φ) + μs cos(Φ') (sin θ + μw sin(Φ) cos θ)] ΔPᵢ
* Δẏɢ = - (1/M) [cos θ - μw sin θ sin Φ + μs sin Φ' (sin θ + μw sin Φ cos θ)] ΔPᵢ


* $P$: Accumulated impulse at any time during impact.
* $P_I^c$: Accumulated impulse at the termination of compression.
* $P_I^f$: The final accumulated value of impulse.

## Numerical Scheme for Ball-Cushion Impact Simulation Compression Phase

This section outlines the numerical scheme used to simulate the motion of a billiard ball during cushion impact, focusing on velocity changes and slip characteristics throughout the collision.

The numerical solution involves iteratively updating the state of the ball using small impulse increments ($\Delta P_I$). It's divided into two phases: compression and restitution.

**Compression Phase:** Continues as long as  `ẏɢ > 0` (ball is still moving towards the cushion).

**Restitution Phase:** Starts when `ẏɢ < 0` and continues until the calculated work done matches the target work for rebound calculated using the coefficient of restitution ($W_{Z'}^I(P_I^f) = (1 - e_e^2) W_{Z'}^I(P_I^c)$).


The core algorithm `updateSingleStep` is shared by both phases, handling the updates to velocities, angular velocities, and work done based on the equations above.

1. **Initialization**:
   * The scheme begins by calculating the initial centroidal velocities (center-of-mass velocities) and slip speeds and angles based on initial conditions.

2. **Velocity Increments**:
   * The algorithm updates the centroidal velocities of the ball using Equation (17a) along with five additional simultaneous equations.
   * Equation (17a) for the x-component velocity increment
   * Additional equations for y-components account for changes in these directions as the impulse accumulates. The z component is assumed zero.

3. **Slip Velocities Calculation**:
   * New slip velocities are computed using updated values from equations (12a), (12b), (13a), and (13b), which relate slip velocities at the cushion and table to the ball’s centroidal velocities.

4. **Rolling Condition Check**:
   * The algorithm includes logic to adjust calculations if a rolling condition (no-slip state) is reached at either the cushion or table contacts, as defined by Equations (15a) and (15b).

5. **Work Done Calculation**:
   * Work done by the normal force at the contact point $I$ along the $Z'$-axis is calculated using Equation (16a) and stored for analysis

This iterative algorithm captures the changes in the ball’s velocity and spin during impact, with stored values enabling further analysis of trajectory variations due to friction and cushion effects.

The numerical scheme is initially stopped when $\dot{z}_I = 0$ (i.e., when the compression phase has ended), A simpler condition is when the ball stops moving toward the cushion i.e.

$$
ẏ_G < 0
$$

the corresponding value of work done is obtained from the array containing

$W_{Z'}^I$ which will be $W_{Z'}^I(P_I^c)$

Now, using Equation (16b), the value $W_{Z'}^I(P_I^f)$ can be calculated, given that $e_e$ is known:

$$W_{Z'}^I(P_I^f) = (1 - e_e^2) W_{Z'}^I(P_I^c)$$

## Restitution Phase

The numerical process of incrementing $P_I$ can resume again, and when $W_{Z'}^I = W_{Z'}^I(P_I^f)$, the process is terminated.

In order to start the numerical scheme, a reasonable estimate for $\Delta P_I$ has to be assumed. An approximate value for $P_I^f$ can be assumed to be $(1 + e_e) M V_0 \sin \alpha$ , which is the value of the final accumulated normal impulse for a horizontally moving, non-spinning ball colliding into a solid vertical wall.

Hence, approximately for $N$ iterations, $\Delta P_I = \frac{(1 + e_e) M V_0 \sin \alpha}{N}$. Obviously, the values of $P_I^c$ and $P_I^f$ will determine the actual number of iterations that take place in the scheme. An initial $N$ of 5000 worked satisfactorily for the scheme.

The paper outlines an algorithm for compression phase while $ẏ_G > 0$

1. CALCULATE INITIAL $s, \Phi, s', \Phi'$
   ESTIMATE $\Delta \dot{x}_G, \ldots, \Delta \dot{\theta}_z$
   *(Use Eqns. 15 and 17)*

2. $\dot{x}_G = \dot{x}_G + \Delta \dot{x}_G$
   $\dot{\theta}_z = \dot{\theta}_z + \Delta \dot{\theta}_z$

3. RECALCULATE $s, \Phi, s', \Phi'$
   *(Use Eqns. 12 and 13)*

4. UPDATE $\dot{X}_G , \ldots, \dot{\theta}_z$

5. ESTIMATE $\Delta W^z$   *(Use Eqn. 16a)*   $W^z = W^z + \Delta W^z$

## References

* A theoretical analysis of billiard ball
dynamics under cushion impacts [[Mathaven paper](https://billiards.colostate.edu/physics_articles/Mathavan_IMechE_2010.pdf)].

## Code generation prompt

Generate TypeScript code for simulating billiard ball dynamics based on cushion impacts, referencing equations from the paper. The code should focus on modularity and readability, implementing a core algorithm to update `State` for both compression and restitution phases, and leveraging shared methods between phases.

Assumptions:
- Use concise, readable TypeScript with minimal inline comments.
- Comments should reference specific equations from the paper, focusing on relevance rather than extensive explanation.
- Implement state updates for both phases within a single `updateSingleStep` function, called by both `compressionPhase` and `restitutionPhase` methods.

Imports are predefined and assumed as shown below and should not be repeated in the solution.


constants.ts

```typescript

export const M = 0.1406
export const R = 0.02625
export const ee = 0.98
export const μs = 0.212
export const μw = 0.14
export const sinθ = 2 / 5
export const cosθ = Math.sqrt(21) / 5
export const N = 5000

```

numericalsolution.ts

```typescript

import { M, R, ee, μs, μw, sinθ, cosθ, N } from "./constants"

export class Mathaven {

  P: number = 0;
  WzI: number = 0;

  // centroid velocity
  vx: number;
  vy: number;

  //angular velocity
  ωx: number;
  ωy: number;
  ωz: number;

  // slip speed and angles at I and C
  s: number;
  φ: number;
  sʹ: number;
  φʹ: number;

  constructor(v0: number, α: number, ω0S: number, ω0T: number) {
    this.vx = v0 * Math.cos(α);
    this.vy = v0 * Math.sin(α);
    this.ωx = -ω0S * Math.sin(α);
    this.ωy = ω0S * Math.cos(α);
    this.ωz = ω0T;
    // initialise φ φ' and s s' based on the initial conditions
  }

  public compressionPhase() {
    // Call updateSingleStep repeatedly until compression end condition
  }

  public restitutionPhase(targetWorkRebound): void {
    // Call updateSingleStep repeatedly until restitution end condition
  }

  private updateSingleStep(ΔP): void {
    // Common function to update velocities, angular velocities, and work done
    this.updateVelocity(ΔP);
    this.updateAngularVelocity(ΔP);
    this.updateWorkDone(ΔP);
  }

  private updateVelocity(ΔP) {
    // Implement velocity updates based on equations 17a and 17b
  }

  private updateAngularVelocity(ΔP) {
    // Implement angular velocity updates based on equations 14d, 14e, and 14f
  }

  private updateWorkDone(ΔP: number): void {
    // Compute work done based on equation 16a
  }

  public solve() {
    // compression phase followed by restitution phase
  }
}

```
