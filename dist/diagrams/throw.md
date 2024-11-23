Notes from https://billiards.colostate.edu/technical_proofs/new/TP_A-14.pdf
This models the throw of a ball ball collision cause by the cut angle and spin on the ball.


**Equation 15: Relative Velocity at contact point (v<sub>rel</sub>)**

v<sub>rel</sub>(v, ω<sub>x</sub>, ω<sub>z</sub>, ϕ) ≔  v * sin(ϕ) + R * ω<sub>z</sub> - (R * ω<sub>x</sub>)<sup>2</sup> * cos(ϕ)


**Equation 16: Throw Angle (θ<sub>throw</sub>)**


θ<sub>throw</sub>(v, ω<sub>x</sub>, ω<sub>z</sub>, ϕ) ≔  atan(v<sub>rel</sub>(v, ω<sub>x</sub>, ω<sub>z</sub>, ϕ) / (v * cos(ϕ)))
   if v<sub>rel</sub>(v, ω<sub>x</sub>, ω<sub>z</sub>, ϕ) = 0, then θ<sub>throw</sub> = 0
   θ<sub>throw</sub> = max(θ<sub>throw</sub>, 0)


*   `v` linear velocity of cue ball.
*    ω<sub>x</sub> top spin ω<sub>z</sub> side spin.
*   `ϕ` cut angle.
*   `R` Ball radius.

**Code generation prompt**

Write two typescript methods in a class to calculate the throw angle. Try to use unicode variable names where possible to closely mirror the equations.

