
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
- $ v_t = \min(\mu \cdot v_{rel}, v \cos(\phi)) $  
- $ v_n = v \sin(\phi) $  

(Referenced from TP A.14, Equation 17 in the document)

Inputs

*   `v` linear velocity of cue ball.
*    ω<sub>x</sub> top spin ω<sub>z</sub> side spin.
*   `ϕ` cut angle.
*   `R` ball radius.
*   `μ` coefficient of friction between balls

**Code generation prompt**

Write two typescript methods in a class to calculate the throw angle. Try to use unicode variable names where possible to closely mirror the equations. No comments

