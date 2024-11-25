
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

At each step recalculate the slip angle and speed at the cushion contact point (I) and the ball and surface of the table contact point (C)

### Slip velocity at cushion 

$$
ẋ_I = \dot{v_x} + \dot{\omega_y} R \sin \theta - \dot{\omega_z} R \cos \theta
$$

$$
ẏ'_I = -\dot{v_y} \sin \theta + \dot{\omega_x} R
$$

### Slip velocity at table 

$$
ẋ_C = \dot{v_x} - \dot{\omega_y} R
$$

$$
ẏ_C = \dot{v_y} + \dot{\omega_x} R
$$
