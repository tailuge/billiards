
### Constants


Coefficient of Restitution $e_e$: Value between the ball and cushion: 0.98

Coefficient of Sliding Friction $μ_s$ : Between the ball and table surface: 0.212

Coefficient of Sliding Friction $μ_w$ : Between the ball and cushion: 0.14

Mass (M): 0.1406 kg

Ball Radius (R): 26.25 mm

In both snooker and pool, h = 7R/5, where R is the ball radius.
The common normal line Z at the contact point with the cushion makes an angle θ with the Y-axis, such that sinθ = 2/5 constant. Thus cosθ = sqrt(21)/5 constant.



### Given inputs to the numerical approximation 
```
V₀: Initial velocity magnitude
α: Incident angle with 0 being perpendicular
ω₀T: Initial topspin angular velocity along line of travel of ball
ω₀S: Initial sidespin angular velocity
```

### Initial Conditions Equations:

Centroid Velocities (Linear Velocities):

```
(ẋG)₁ = V₀ cos(α)     // Initial x velocity perpendicular to cushion
(ẏG)₁ = V₀ sin(α)  
(żG)₁ = 0            
```

Angular Velocities:

```
(θ̇x)₁ = -ω₀T sin(α)   // Initial angular velocity around x-axis
(θ̇y)₁ = ω₀T cos(α)    // Initial angular velocity around y-axis
(θ̇z)₁ = ω₀S           // Initial angular velocity around z-axis (sidespin)
```

Slip Speed at Point I (cushion contact):

```
s(0) = √[(V₀ cos(α) + R(ω₀T cos(α)sin(θ) - ω₀S cos(θ)))² + (-V₀ sin(α)sin(θ) - Rω₀T sin(α))²]
```

Slip Speed at Point C (table contact):

```
s'(0) = |V₀ - Rω₀T|
```

Slip Angle at Point I:


$\Phi$(0) = tan⁻¹((-V₀ sin(α)sin(θ) - Rω₀T sin(α)) / (V₀ cos(α) + R(ω₀T cos(α)sin(θ) - ω₀S cos(θ))))

Slip Angle at Point C:

$\Phi^{\prime}$(0) = α            when V₀ - Rω₀T > 0

$\Phi^{\prime}$(0) = 180° + α     when V₀ - Rω₀T < 0

undefined when V₀ = Rω₀T (rolling condition)

- $P$: Accumulated impulse at any time during impact.
- $P_I^c$: Accumulated impulse at the termination of compression.
- $P_I^f$: The final accumulated value of impulse.


#### Equation (17a): x-component velocity increment
$$
(ẋ_G)_{n+1} - (ẋ_G)_n = - \frac{1}{M} \left[\mu_w \cos(\phi) + \mu_s \cos(\phi') \cdot (\sin \theta + \mu_w \sin(\phi) \cos \theta)\right] \Delta P_I
$$

#### Equation (12a): Slip velocity at cushion along the x-axis
$$
ẋ_I = ẋ_G + θ̇_y R \sin \theta - θ̇_z R \cos \theta
$$

#### Equation (12b): Slip velocity at cushion along the y-axis (transformed to y')
$$
ẏ'_I = -ẏ_G \sin \theta + ż_G \cos \theta + θ̇_x R
$$

#### Equation (13a): Slip velocity at table along the x-axis
$$
ẋ_C = ẋ_G - θ̇_y R
$$

#### Equation (13b): Slip velocity at table along the y-axis
$$
ẏ_C = ẏ_G + θ̇_x R
$$

#### Equation (15a): Rolling condition for the ball at the cushion (when slip speed \( s = 0 \))
$$
\Delta P_I^x = 0, \quad \Delta P_I^{y'} = 0
$$

#### Equation (15b): Rolling condition for the ball at the table (when slip speed \( s' = 0 \))
$$
\Delta P_C^x = 0, \quad \Delta P_C^y = 0
$$

#### Equation (16a): Work done by the normal force at contact point \( I \) along the \( Z' \)-axis

$$
(W_{Z'}^I)_{n+1}-(W_Z'^I)_n = \Delta P_I \cdot \frac{(ż'_I)_n + (ż'_I)_m}{2}
$$

*where m=n+1*


#### Equation (17a)

$$
(ẋ_G)_{n+1} - (ẋ_G)_n = - \frac{1}{M} \left[\mu_w \cos(\phi) + \mu_s \cos(\phi') \cdot (\sin \theta + \mu_w \sin(\phi) \cos \theta)\right] \Delta P_I
$$

$$
(ẏ_G)_{n+1} - (ẏ_G)_n  = - \frac{1}{M} \left[ \cos \theta - \mu_w \sin \theta \sin \phi + \mu_s \sin \phi' \cdot \left( \sin \theta + \mu_w \sin \phi \cos \theta \right) \right] \Delta P_I
$$

### Numerical Scheme for Ball-Cushion Impact Simulation Compression Phase

This section outlines the numerical scheme used to simulate the motion of a billiard ball during cushion impact, focusing on velocity changes and slip characteristics throughout the collision.

1. **Initialization**:
   - The scheme begins by calculating the initial centroidal velocities (center-of-mass velocities) and slip speeds and angles based on initial conditions.

2. **Velocity Increments**:
   - The algorithm updates the centroidal velocities of the ball using Equation (17a) along with five additional simultaneous equations.
   - Equation (17a) for the x-component velocity increment
   - Additional equations for z-components account for changes in these directions as the impulse accumulates. The z component is assumed zero.

3. **Slip Velocities Calculation**:
   - New slip velocities are computed using updated values from equations (12a), (12b), (13a), and (13b), which relate slip velocities at the cushion and table to the ball’s centroidal velocities.

4. **Rolling Condition Check**:
   - The algorithm includes logic to adjust calculations if a rolling condition (no-slip state) is reached at either the cushion or table contacts, as defined by Equations (15a) and (15b).

5. **Work Done Calculation**:
   - Work done by the normal force at the contact point \( I \) along the \( Z' \)-axis is calculated using Equation (16a) and stored for analysis
   

This iterative algorithm captures the changes in the ball’s velocity and spin during impact, with stored values enabling further analysis of trajectory variations due to friction and cushion effects.

The numerical scheme is initially stopped when $\dot{z}_I = 0$ (i.e., when the compression phase has ended), A simpler condition is when the ball stops moving toward the cushion i.e.

$$
ẏ_G < 0
$$

the corresponding value of work done is obtained from the array containing 

$W_{Z'}^I$ which will be $W_{Z'}^I(P_I^c)$

Now, using Equation (16b), the value $W_{Z'}^I(P_I^f)$ can be calculated, given that $e_e$ is known:

$$W_{Z'}^I(P_I^f) = (1 - e_e^2) W_{Z'}^I(P_I^c)$$

### Restitution Phase

The numerical process of incrementing $P_I$ can resume again, and when $W_{Z'}^I = W_{Z'}^I(P_I^f)$, the process is terminated.

In order to start the numerical scheme, a reasonable value for $\Delta P_I$ has to be assumed. An approximate value for $P_I^f$ can be assumed to be $(1 + e_e) M V_0 \sin \alpha$ , which is the value of the final accumulated normal impulse for a horizontally moving, non-spinning ball colliding into a solid vertical wall.

Hence, approximately for $N$ iterations, $\Delta P_I = \frac{(1 + e_e) M V_0 \sin \alpha}{N}$. Obviously, the values of $P_I^c$ and $P_I^f$ will determine the actual number of iterations that take place in the scheme. An initial $N$ of 5000 worked satisfactorily for the scheme.

**References:**

- A theoretical analysis of billiard ball
dynamics under cushion impacts [[Mathaven paper](https://billiards.colostate.edu/physics_articles/Mathavan_IMechE_2010.pdf)].


**Code generation**

Assumptions for typescript code generation - use ThreeJS library, provide minimal readable code that breaks out functions where appropraite. Comments should be minimal but reference equations from the paper.

```typescript
import { Vector3 } from 'vector3';

interface InitialConditions {
  V0: number;          // Initial velocity magnitude
  alpha: number;       // Incident angle (radians)
  w0T: number;         // Initial topspin angular velocity
  w0S: number;         // Initial sidespin angular velocity
}

interface Constants {
  M: number;           // Mass = 0.1406 kg
  R: number;           // Ball radius = 26.25 mm
  ee: number;          // Coefficient of restitution = 0.98
  μs: number;          // Coefficient of sliding friction (table) = 0.212
  μw: number;          // Coefficient of sliding friction (cushion) = 0.14
  sinTheta: number;    // Fixed angle of cushion contact point above ball center
  cosTheta: number;    // Fixed angle of cushion contact point above ball center 
  N: number;           // Number of iterations
}

const constants: Constants = {
  M: 0.1406,
  R: 0.02625,
  ee: 0.98,
  μs: 0.212,
  μw: 0.14,
  sinTheta: 2/5
  cosTheta: Math.sqrt(21)/5
  N: 5000
};

class CompressionPhase {

  // State variables during compression
  private xG_dot: number;    // ẋG - x component of centroid velocity
  private yG_dot: number;    // ẏG - y component of centroid velocity
  private zG_dot: number;    // żG - z component of centroid velocity (always 0)
  
  private θx_dot: number;    // θ̇x - angular velocity around x-axis
  private θy_dot: number;    // θ̇y - angular velocity around y-axis
  private θz_dot: number;    // θ̇z - angular velocity around z-axis

  private P: number;         // Accumulated impulse
  private WzI: number;       // Work done at point I
  private ΔP: number;        // Impulse increment

  constructor(initial: InitialConditions) {
    this.setInitialConditions(initial);
  }

  ... complete this class ...
}
```


