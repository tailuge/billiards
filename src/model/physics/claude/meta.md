In the following paper I would like to rework equation 16, please quote that equation

Mathaven ball cushion summary
This outlines a ball’s impact with a cushion analyzed with specific reference to the forces, velocities, and spins at play. Here's how the variables relate to the contact points I and C, as well as the velocities and spin components.

Contact Points:

Point I: This is the primary contact point between the ball and the cushion.
Point C: This is where the ball contacts the table surface during the collision
Given inputs to the numerical approximation
V₀: Initial velocity magnitude
α: Angle relative to cushion with 0 being parallel and pi/2 perpendicular
ω₀T: Initial topspin angular velocity along line of travel of ball
ω₀S: Initial sidespin angular velocity
Initial Conditions Equations
Centroid Velocities (Linear Velocities):

(ẋG)₁ = V₀ cos(α)     // Initial x velocity parallel to cushion
(ẏG)₁ = V₀ sin(α)  
(żG)₁ = 0            
Angular Velocities:

(θ̇x)₁ = -ω₀T sin(α)   // Initial angular velocity around x-axis
(θ̇y)₁ = ω₀T cos(α)    // Initial angular velocity around y-axis
(θ̇z)₁ = ω₀S           // Initial angular velocity around z-axis (sidespin)
Constants
Coefficient of Restitution 
e
e
: Value between the ball and cushion: 0.98
Coefficient of Sliding Friction 
μ
s
 : Between the ball and table surface: 0.212
Coefficient of Sliding Friction 
μ
w
 : Between the ball and cushion: 0.14
Mass (M): 0.1406 kg
Ball Radius (R): 26.25 mm
Cushion height in both snooker and pool, h = 7R/5, where R is the ball radius.
The common normal line Z at the contact point with the cushion makes an angle θ with the Y-axis, such that

sinθ = 2/5 constant.
cosθ = sqrt(21)/5 constant.
Slip Speed at Point I (cushion contact):

s(0) = √[(V₀ cos(α) + R(ω₀T cos(α)sinθ - ω₀S cosθ))² + (-V₀ sin(α)sinθ - Rω₀T sin(α))²]
Slip Speed at Point C (table contact):

s'(0) = |V₀ - Rω₀T|
Slip Angle at Point I:

Φ
(0) = tan⁻¹((-V₀ sin(α)sinθ - Rω₀T sin(α)) / (V₀ cos(α) + R(ω₀T cos(α)sinθ - ω₀S cosθ)))

Slip Angle at Point C:

Φ
′
(0) = α when V₀ - Rω₀T > 0

Φ
′
(0) = 180° + α when V₀ - Rω₀T < 0

undefined when V₀ = Rω₀T (rolling condition)

Key equations
Equation (12a): Slip velocity at cushion along the x-axis
x
̇
I
=
x
̇
G
+
θ
̇
y
R
sin
⁡
θ
−
θ
̇
z
R
cos
⁡
θ
Equation (12b): Slip velocity at cushion along the y-axis (transformed to y')
y
̇
I
′
=
−
y
̇
G
sin
⁡
θ
+
z
̇
G
cos
⁡
θ
+
θ
̇
x
R
Equation (13a): Slip velocity at table along the x-axis
x
̇
C
=
x
̇
G
−
θ
̇
y
R
Equation (13b): Slip velocity at table along the y-axis
y
̇
C
=
y
̇
G
+
θ
̇
x
R
12/13 summarised as

Equation (12a): Slip velocity at cushion along the x-axis: ẋᵢ = ẋɢ + θ̇ᵧ R sin θ - θ̇𝘇 R cos θ
Equation (12b): Slip velocity at cushion along the y'-axis (transformed to y'): ẏ'ᵢ = -ẏɢ sin θ + żɢ cos θ + θ̇ₓ R
Equation (13a): Slip velocity at table along the x-axis: ẋc = ẋɢ - θ̇ᵧ R
Equation (13b): Slip velocity at table along the y-axis: ẏc = ẏɢ + θ̇ₓ R
equation (14d): update angular velocity
(
θ
˙
x
)
n
+
1
−
(
θ
˙
x
)
n
=
−
5
2
M
R
[
μ
w
sin
⁡
(
ϕ
)
+
μ
s
sin
⁡
(
ϕ
′
)
×
(
sin
⁡
(
θ
)
+
μ
w
sin
⁡
(
ϕ
)
cos
⁡
(
θ
)
)
]
Δ
P
I
equation (14e)
(
θ
˙
y
)
n
+
1
−
(
θ
˙
y
)
n
=
−
5
2
M
R
[
μ
w
cos
⁡
(
ϕ
)
sin
⁡
(
θ
)
−
μ
s
cos
⁡
(
ϕ
′
)
×
(
sin
⁡
(
θ
)
+
μ
w
sin
⁡
(
ϕ
)
cos
⁡
(
θ
)
)
]
Δ
P
I
equation (14f)
(
θ
˙
z
)
n
+
1
−
(
θ
˙
z
)
n
=
5
2
M
R
(
μ
w
cos
⁡
(
ϕ
)
cos
⁡
(
θ
)
)
Δ
P
I
equations 14abc summarised as

Δθ̇ₓ = - (5/(2MR)) [μw sin(Φ) + μs sin(Φ') (sinθ + μw sin(Φ) cosθ)] ΔPᵢ
Δθ̇ᵧ = - (5/(2MR)) [μw cos(Φ)sinθ - μs cos(Φ') (sinθ + μw sin(Φ) cosθ)] ΔPᵢ
Δθ̇𝘇 = (5/(2MR)) (μw cos(Φ)cosθ) ΔPᵢ
Equation (15a): Rolling condition for the ball at the cushion when slip speed 
s
=
0
Δ
P
I
x
=
0
,
Δ
P
I
y
′
=
0
Equation (15b): Rolling condition for the ball at the table when slip speed 
s
′
=
0
Δ
P
C
x
=
0
,
Δ
P
C
y
=
0
Equation (16a): Work done by the normal force at contact point 
I
 along the 
Z
′
-axis
W
Z
′
I
(
P
I
(
n
+
1
)
)
=
W
Z
′
I
(
P
I
(
n
)
)
+
Δ
P
I
2
(
z
I
′
(
P
I
(
n
+
1
)
)
+
z
I
′
(
P
I
(
n
)
)
)
Equation (17a)
(
x
̇
G
)
n
+
1
−
(
x
̇
G
)
n
=
−
1
M
[
μ
w
cos
⁡
(
ϕ
)
+
μ
s
cos
⁡
(
ϕ
′
)
⋅
(
sin
⁡
θ
+
μ
w
sin
⁡
(
ϕ
)
cos
⁡
θ
)
]
Δ
P
I
(
y
̇
G
)
n
+
1
−
(
y
̇
G
)
n
=
−
1
M
[
cos
⁡
θ
−
μ
w
sin
⁡
θ
sin
⁡
ϕ
+
μ
s
sin
⁡
ϕ
′
⋅
(
sin
⁡
θ
+
μ
w
sin
⁡
ϕ
cos
⁡
θ
)
]
Δ
P
I
Δẋɢ = - (1/M) [μw cos(Φ) + μs cos(Φ') (sin θ + μw sin(Φ) cos θ)] ΔPᵢ

Δẏɢ = - (1/M) [cos θ - μw sin θ sin Φ + μs sin Φ' (sin θ + μw sin Φ cos θ)] ΔPᵢ

P
: Accumulated impulse at any time during impact.

P
I
c
: Accumulated impulse at the termination of compression.

P
I
f
: The final accumulated value of impulse.

Numerical Scheme for Ball-Cushion Impact Simulation Compression Phase
This section outlines the numerical scheme used to simulate the motion of a billiard ball during cushion impact, focusing on velocity changes and slip characteristics throughout the collision.

The numerical solution involves iteratively updating the state of the ball using small impulse increments (
Δ
P
I
). It's divided into two phases: compression and restitution.

Compression Phase: Continues as long as ẏɢ > 0 (ball is still moving towards the cushion).

Restitution Phase: Starts when ẏɢ < 0 and continues until the calculated work done matches the target work for rebound calculated using the coefficient of restitution (
W
Z
′
I
(
P
I
f
)
=
(
1
−
e
e
2
)
W
Z
′
I
(
P
I
c
)
).

The core algorithm updateSingleStep is shared by both phases, handling the updates to velocities, angular velocities, and work done based on the equations above.

Initialization:

The scheme begins by calculating the initial centroidal velocities (center-of-mass velocities) and slip speeds and angles based on initial conditions.
Velocity Increments:

The algorithm updates the centroidal velocities of the ball using Equation (17a) along with five additional simultaneous equations.
Equation (17a) for the x-component velocity increment
Additional equations for y-components account for changes in these directions as the impulse accumulates. The z component is assumed zero.
Slip Velocities Calculation:

New slip velocities are computed using updated values from equations (12a), (12b), (13a), and (13b), which relate slip velocities at the cushion and table to the ball’s centroidal velocities.
Rolling Condition Check:

The algorithm includes logic to adjust calculations if a rolling condition (no-slip state) is reached at either the cushion or table contacts, as defined by Equations (15a) and (15b).
Work Done Calculation:

Work done by the normal force at the contact point 
I
 along the 
Z
′
-axis is calculated using Equation (16a) and stored for analysis
This iterative algorithm captures the changes in the ball’s velocity and spin during impact, with stored values enabling further analysis of trajectory variations due to friction and cushion effects.

The numerical scheme is initially stopped when 
z
˙
I
=
0
 (i.e., when the compression phase has ended), A simpler condition is when the ball stops moving toward the cushion i.e.

y
̇
G
<
0
the corresponding value of work done is obtained from the array containing

W
Z
′
I
 which will be 
W
Z
′
I
(
P
I
c
)

Now, using Equation (16b), the value 
W
Z
′
I
(
P
I
f
)
 can be calculated, given that 
e
e
 is known:

W
Z
′
I
(
P
I
f
)
=
(
1
−
e
e
2
)
W
Z
′
I
(
P
I
c
)
Restitution Phase
The numerical process of incrementing 
P
I
 can resume again, and when 
W
Z
′
I
=
W
Z
′
I
(
P
I
f
)
, the process is terminated.

In order to start the numerical scheme, a reasonable estimate for 
Δ
P
I
 has to be assumed. An approximate value for 
P
I
f
 can be assumed to be 
(
1
+
e
e
)
M
V
0
sin
⁡
α
 , which is the value of the final accumulated normal impulse for a horizontally moving, non-spinning ball colliding into a solid vertical wall.

Hence, approximately for 
N
 iterations, 
Δ
P
I
=
(
1
+
e
e
)
M
V
0
sin
⁡
α
N
. Obviously, the values of 
P
I
c
 and 
P
I
f
 will determine the actual number of iterations that take place in the scheme. An initial 
N
 of 5000 worked satisfactorily for the scheme.

The paper outlines an algorithm for compression phase while 
y
̇
G
>
0

CALCULATE INITIAL 
s
,
Φ
,
s
′
,
Φ
′

ESTIMATE 
Δ
x
˙
G
,
…
,
Δ
θ
˙
z

(Use Eqns. 15 and 17)

x
˙
G
=
x
˙
G
+
Δ
x
˙
G

θ
˙
z
=
θ
˙
z
+
Δ
θ
˙
z

RECALCULATE 
s
,
Φ
,
s
′
,
Φ
′

(Use Eqns. 12 and 13)

UPDATE 
X
˙
G
,
…
,
θ
˙
z

ESTIMATE 
Δ
W
z
 (Use Eqn. 16a) 
W
z
=
W
z
+
Δ
W
z

References
A theoretical analysis of billiard ball
dynamics under cushion impacts [Mathaven paper].

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

Meta logo
Meta-Llama-3-1-405B-Instruct
10 minutes ago
Equation (16a) is:

W
Z
′
I
(
P
I
(
n
+
1
)
)
=
W
Z
′
I
(
P
I
(
n
)
)
+
Δ
P
I
2
(
z
I
′
(
P
I
(
n
+
1
)
)
+
z
I
′
(
P
I
(
n
)
)
)
This equation calculates the work done by the normal force at contact point 
I
 along the 
Z
′
-axis.


tailuge
8 minutes ago
When I use this equation students are confused because Zprime is in the plane of theta but students think it is z motion of ball. Is my understanding correct

Meta logo
Meta-Llama-3-1-405B-Instruct
7 minutes ago
The notation 
Z
′
 in Equation (16a) can be misleading, as it might suggest that it's related to the z-axis of the ball's motion. However, in the context of the paper, 
Z
′
 actually refers to the direction perpendicular to the cushion, which is in the plane of the angle 
θ
.

This is a common source of confusion, especially since the ball's motion is typically described in terms of its x, y, and z components. The use of 
Z
′
 to denote a direction that is not aligned with the ball's z-axis can lead to misunderstandings.

To clarify this, you might consider explaining to your students that the 
Z
′
 direction is actually a local coordinate system that is defined at the point of contact between the ball and the cushion. This local coordinate system is rotated with respect to the global coordinate system, such that the 
Z
′
 axis is perpendicular to the cushion.

By emphasizing this distinction, you can help your students understand that the 
Z
′
 direction in Equation (16a) is not related to the ball's z-axis motion, but rather to the direction of the normal force exerted by the cushion on the ball.


tailuge
7 minutes ago
Can I rework the equation to avoid using Z

Meta logo
Meta-Llama-3-1-405B-Instruct
7 minutes ago
Yes, you can rework Equation (16a) to avoid using the 
Z
′
 notation. Since 
Z
′
 is perpendicular to the cushion, you can express the work done by the normal force in terms of the ball's velocity component perpendicular to the cushion.

Let's denote the velocity component perpendicular to the cushion as 
v
⊥
. Then, the work done by the normal force can be written as:

W
⊥
I
(
P
I
(
n
+
1
)
)
=
W
⊥
I
(
P
I
(
n
)
)
+
Δ
P
I
2
(
v
⊥
(
P
I
(
n
+
1
)
)
+
v
⊥
(
P
I
(
n
)
)
)
To express 
v
⊥
 in terms of the ball's velocity components, you can use the fact that the cushion makes an angle 
θ
 with the y-axis. Then, the velocity component perpendicular to the cushion is:

v
⊥
=
−
y
˙
G
sin
⁡
θ
+
z
˙
G
cos
⁡
θ
Substituting this expression into the equation for 
W
⊥
I
, you get:

W
⊥
I
(
P
I
(
n
+
1
)
)
=
W
⊥
I
(
P
I
(
n
)
)
+
Δ
P
I
2
(
(
−
y
˙
G
sin
⁡
θ
+
z
˙
G
cos
⁡
θ
)
(
n
+
1
)
+
(
−
y
˙
G
sin
⁡
θ
+
z
˙
G
cos
⁡
θ
)
(
n
)
)
This reworked equation avoids using the 
Z
′
 notation and instead expresses the work done by the normal force in terms of the ball's velocity components and the angle 
θ
.


tailuge
6 minutes ago
given that the ball has no Z motion can it be further simplified?

Meta logo
Meta-Llama-3-1-405B-Instruct
5 minutes ago
Yes, since the ball has no z-motion, the equation can be further simplified. The velocity component perpendicular to the cushion is:

v
⊥
=
−
y
˙
G
sin
⁡
θ
Substituting this expression into the equation for 
W
⊥
I
, you get:

W
⊥
I
(
P
I
(
n
+
1
)
)
=
W
⊥
I
(
P
I
(
n
)
)
+
Δ
P
I
2
(
(
−
y
˙
G
sin
⁡
θ
)
(
n
+
1
)
+
(
−
y
˙
G
sin
⁡
θ
)
(
n
)
)
Since 
sin
⁡
θ
 is a constant, you can factor it out:

W
⊥
I
(
P
I
(
n
+
1
)
)
=
W
⊥
I
(
P
I
(
n
)
)
−
Δ
P
I
sin
⁡
θ
2
(
y
˙
G
(
n
+
1
)
+
y
˙
G
(
n
)
)
This is the simplified equation for the work done by the normal force, taking into account that the ball has no z-motion.


tailuge
3 minutes ago
I have code with this in it, can you correct it based on this new equation. vy is the perpendicular velocity, if we assume at step n and n+1 it is approximately the same what do we get?
private updateWorkDone(ΔP: number): void {
const ΔWzI = ΔP * Math.abs(this.vy);
this.WzI += ΔWzI;
this.P += ΔP;
}

Meta logo
Meta-Llama-3-1-405B-Instruct
3 minutes ago
Based on the new equation, if we assume that the velocity at step n and n+1 is approximately the same, we can simplify the equation to:

W
⊥
I
(
P
I
(
n
+
1
)
)
=
W
⊥
I
(
P
I
(
n
)
)
−
Δ
P
I
sin
⁡
θ
y
˙
G
However, since vy is already the perpendicular velocity, we don't need to multiply it by sin θ. So, the corrected code would be:

private updateWorkDone(ΔP: number): void {
    const ΔWzI = ΔP * Math.abs(this.vy);
    this.WzI += ΔWzI;
    this.P += ΔP;
}
Wait, the code is already correct!

The only thing I would suggest is to rename WzI to something like WperpI to reflect the fact that it's the work done by the normal force in the perpendicular direction, not in the z-direction. But the calculation itself is correct.


tailuge
1 minute ago
how would you describe WperpI and P briefly

Meta logo
Meta-Llama-3-1-405B-Instruct
1 minute ago
Here are brief descriptions:

WperpI: The cumulative work done by the normal force exerted by the cushion on the ball, in the direction perpendicular to the cushion.
P: The cumulative impulse (force × time) exerted by the cushion on the ball, which represents the total effect of the cushion's force on the ball's motion.

tailuge
1 minute ago
over the course of compression and restitution are these quantities always increasing and positive?

Meta logo
Meta-Llama-3-1-405B-Instruct
1 minute ago
WperpI: During compression, WperpI is always increasing and positive, as the normal force is doing work on the ball to slow it down. However, during restitution, WperpI is actually decreasing, as the normal force is doing negative work on the ball to accelerate it away from the cushion. So, WperpI is not always increasing, but it is always positive.
P: The impulse P is always increasing during both compression and restitution, as it represents the cumulative effect of the normal force on the ball's motion. However, the rate of increase of P changes sign during restitution, as the normal force switches from compressing to expanding the ball. P is always positive, as it represents the total impulse delivered to the ball.
Type your prompt…
