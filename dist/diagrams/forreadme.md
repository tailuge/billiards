Slip velocity at cushion contact point I

$$
ẋ_I = \dot{v_x} + \dot{\omega_y} R \sin \theta - \dot{\omega_z} R \cos \theta
$$

$$
ẏ'_I = -\dot{v_y} \sin \theta + \dot{\omega_x} R
$$

$$
\phi = \arctan\left(\frac{ẏ'_I}{ẋ_I}\right)
$$

$$
s = \sqrt{(ẋ_I)^2 + (ẏ'_I)^2}
$$

Slip velocity at table contact point C

$$
ẋ_C = \dot{v_x} - \dot{\omega_y} R
$$

$$
ẏ_C = \dot{v_y} + \dot{\omega_x} R
$$

$$
\phi' = \arctan\left(\frac{ẏ'_I}{ẋ_I}\right)
$$

$$
s' = \sqrt{(ẋ_C)^2 + (ẏ_C)^2}
$$

Numerical updates to the centroid velocity of the ball during compression and resititution phases.

$$
(\dot{v_x})_{n+1} - (\dot{v_x})_n = - \frac{1}{M} \left[\mu_w \cos(\phi) + \mu_s \cos(\phi') \cdot (\sin \theta + \mu_w \sin(\phi) \cos \theta)\right] \Delta P_I
$$

$$
(\dot{v_y})_{n+1} - (\dot{v_y})_n  = - \frac{1}{M} \left[ \cos \theta - \mu_w \sin \theta \sin \phi + \mu_s \sin \phi' \cdot \left( \sin \theta + \mu_w \sin \phi \cos \theta \right) \right] \Delta P_I
$$

Updates for angular velocity of ball

$$
(\dot{\omega_x})_{n+1}−(\dot{\omega_x})_n = -\frac{5}{2MR}[\mu_w \sin(\phi) + \mu_s \sin(\phi') \times (\sin(\theta) + \mu_w \sin(\phi)\cos(\theta))]\Delta P_I
$$


$$
(\dot{\omega_y})_{n+1}−(\dot{\omega_y})_n = -\frac{5}{2MR}[\mu_w \cos(\phi)\sin(\theta) - \mu_s \cos(\phi') \times (\sin(\theta) + \mu_w \sin(\phi)\cos(\theta))]\Delta P_I
$$


$$
(\dot{\omega_z})_{n+1}−(\dot{\omega_z})_n = \frac{5}{2MR}(\mu_w \cos(\phi)\cos(\theta))\Delta P_I
$$

$`\theta`$ is a constant of the angle of cushion contact above ball centre with $`\sin(\theta) = 2/5`$

Work done by the normal force at contact point $I$ along the $Z'$-axis

$$
W_{Z'}^I(P_I^{(n+1)}) = W_{Z'}^I(P_I^{(n)}) + \frac{\Delta P_I}{2} \left( z'_I(P_I^{(n+1)}) + z'_I(P_I^{(n)}) \right)
$$

The ball is assumed to be bouncing in the +y cushion. Compression phase iterates until 

$$
\dot{v_y} <= 0
$$

For the restitution phase the iteration continues until the work done is

$$
W_{Z'}^I >= (1 - e_e^2) W_{compression}
$$
