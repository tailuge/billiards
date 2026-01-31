# billiards

[![codecov](https://codecov.io/gh/tailuge/billiards/branch/master/graph/badge.svg?token=BH11KRAEL0)](https://codecov.io/gh/tailuge/billiards)
[![CodeFactor](https://www.codefactor.io/repository/github/tailuge/billiards/badge)](https://www.codefactor.io/repository/github/tailuge/billiards)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=tailuge_billiards&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=tailuge_billiards)
[![Tests](https://github.com/tailuge/billiards/actions/workflows/main.yml/badge.svg)](https://github.com/tailuge/billiards/actions/workflows/main.yml)
[![Open in Gitpod](https://img.shields.io/badge/Gitpod-Open%20in%20Gitpod-%230092CF.svg)](https://gitpod.io/#https://github.com/tailuge/billiards)
![GitHub](https://img.shields.io/github/license/tailuge/billiards.svg)

[![Demo and Screenshot](https://raw.githubusercontent.com/tailuge/billiards/master/dist/images/t3.png)](https://tailuge.github.io/billiards/dist)

This is an open-source project bringing unsophisticated billiards physics written in typescript to the browser. Play pool, snooker, or 3-cushion online right here.

## Features

* Backspin, sidespin an cushion bounces well modeled.
* Presentation using WebGL in any modern browser on mobile, linux, mac or windows.
* Record and playback breaks.
* Two player online mode with nchan nginx server.
* Nine ball, snooker and three cushion billiards rules.
* Deploys to github pages, vercel.com and render.com with github actions.

## Online Demo

Demos run in all major desktop and mobile browsers and uses WebGL

* [Nine ball ⬀](https://tailuge.github.io/billiards/dist) make a break and share replay link with friends
* [Three cushion billiards ⬀](https://tailuge.github.io/billiards/dist?ruletype=threecushion) the ultimate test of physics and player (average on both counts)
* [Snooker ⬀](https://tailuge.github.io/billiards/dist?ruletype=snooker) we await the first 147 submission to the leaderboard.
* 4-ball [Straight pool ⬀](https://tailuge.github.io/billiards/dist?ruletype=fourteenone). 
* Inspect physics and tweak constants using [diagrams](https://tailuge.github.io/billiards/dist/diagrams/diagrams.html).
* Try to get on the leaderboard of highest [breaks](https://scoreboard-tailuge.vercel.app/leaderboard.html) hosted on vercel.com
* Try [two player](https://scoreboard-tailuge.vercel.app/game) online lobby using nchan

## Reference material

* Papers on ball mechanics [Han 2005](https://billiards.colostate.edu/physics_articles/Han_paper.pdf)
with important corrections by [Kiefl](https://ekiefl.github.io/2020/04/24/pooltool-theory/#3-han-2005").
* [cushions](https://billiards.colostate.edu/physics_articles/Mathavan_IMechE_2010.pdf), [max spin](https://billiards.colostate.edu/technical_proofs/new/TP_B-17.pdf),
simulation and constants [1](https://savoirs.usherbrooke.ca/bitstream/handle/11143/6598/MR91690.pdf?sequence=1)
[2](http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.89.4627&rep=rep1&type=pdf)
[3](https://www.researchgate.net/publication/228634093_Bounce_of_a_spinning_ball_near_normal_incidence)
[4](https://billiards.colostate.edu/technical_proofs/new/TP_B-6.pdf)
[5](https://billiards.colostate.edu/faq/physics/physical-properties/)
* 3D graphics uses [three.js](https://threejs.org/docs/index.html#api/math/Vector3)
* Inline [LaTeX](https://www.codecogs.com/eqnedit.php?latex=\dot{a}) editor
for equations in README.md

### Key equations

Based on [Han 2005](https://billiards.colostate.edu/physics_articles/Han_paper.pdf) paper

#### surface velocity

![equation](http://latex.codecogs.com/png.latex?\vec{v{_{a}}}%20=%20\vec{v}+%20(\vec{up}%20\times%20R\vec{\omega}))

#### sliding motion

![equation](http://latex.codecogs.com/png.latex?\dot{v}%20=%20-\mu%20g%20\frac{\vec{v_{a}}}{\left%20|%20\vec{v_{a}}%20\right%20|})

![equation](http://latex.codecogs.com/png.latex?\dot{w}%20=%20-\frac{5}{2}\frac{\mu%20g}{R}%20\frac{\vec{v_{a}}}{\left%20|%20\vec{v_{a}}%20\right%20|})

![equation](http://latex.codecogs.com/png.latex?\dot{\omega}_{z}%20=%20-\frac{5}{2}\frac{M_{z}}{mR^2}sgn(\omega_{z}))

#### rolling motion

![equation](http://latex.codecogs.com/png.latex?\dot{v}%20=%20-\frac{5}{7}\frac{M_{xy}}{mR}\frac{\vec{up}\times\vec{\omega}}{\left%20|%20\vec{w}%20\right%20|})

![equation](http://latex.codecogs.com/png.latex?\dot{w}%20=%20-\frac{5}{7}\frac{M_{xy}}{mR^2}\frac{\vec{\omega}}{\left%20|%20\vec{w}%20\right%20|})

where

![equation](https://latex.codecogs.com/svg.image?M_{xy}=\frac{7}{5\sqrt{2}}R\mu&space;m&space;g)
,![equation](https://latex.codecogs.com/svg.image?M_{z}=\frac{2}{3}\mu&space;m&space;g\rho)

#### collisions

Based on paper by [Alciatore](https://billiards.colostate.edu/technical_proofs/new/TP_A-14.pdf) incorporating throw effect due to the small amount of friction between balls. Figures to prove consistency between the [code](./src/model/physics/collisionthrow.ts) and paper [here](https://tailuge.github.io/billiards/dist/diagrams/mathaven.html). 


For ball $a$:

![Equation 1](https://latex.codecogs.com/gif.latex?%5Cvec%7Bv%7D_a%20%5Cleftarrow%20%5Cvec%7Bv%7D_a%20%2B%20%5Cfrac%7BJ_%7B%5Ctext%7Bnormal%7D%7D%7D%7Bm%7D%5Chat%7Bn%7D%20%2B%20%5Cfrac%7BJ_%7B%5Ctext%7Btangential%7D%7D%7D%7Bm%7D%5Chat%7Bt%7D)

![Equation for Angular Velocity of Ball a](https://latex.codecogs.com/gif.latex?%5Cvec%7B%5Comega%7D_a%20%5Cleftarrow%20%5Cvec%7B%5Comega%7D_a%20%2B%20%5Cfrac%7B1%7D%7BI%7D%20%28%5Cvec%7Br%7D_a%20%5Ctimes%20%5Cvec%7BJ%7D_%7B%5Ctext%7Btangential%7D%7D%29)

For ball $b$:

![Equation 2](https://latex.codecogs.com/gif.latex?%5Cvec%7Bv%7D_b%20%5Cleftarrow%20%5Cvec%7Bv%7D_b%20-%20%5Cfrac%7BJ_%7B%5Ctext%7Bnormal%7D%7D%7D%7Bm%7D%5Chat%7Bn%7D%20-%20%5Cfrac%7BJ_%7B%5Ctext%7Btangential%7D%7D%7D%7Bm%7D%5Chat%7Bt%7D)


![Equation for Angular Velocity of Ball b](https://latex.codecogs.com/gif.latex?%5Cvec%7B%5Comega%7D_b%20%5Cleftarrow%20%5Cvec%7B%5Comega%7D_b%20%2B%20%5Cfrac%7B1%7D%7BI%7D%20%28%5Cvec%7Br%7D_b%20%5Ctimes%20%5Cvec%7BJ%7D_%7B%5Ctext%7Btangential%7D%7D%29)


Where:

The relative velocity at the point of contact is computed as:

$\vec{v}_{\text{rel}} = (\vec{v}_a - \vec{v}_b) + \vec{r}_a \times \vec{\omega}_a - \vec{r}_b \times \vec{\omega}_b$

$`\vec{v}_{\text{slip}}`$ = $`\vec{v}_{\text{rel}}`$ - $`(\vec{v}_{\text{rel}} \cdot \hat{n}) \hat{n}`$

$\vec{r}_a = -R \cdot \hat{n}$ and $\vec{r}_b = R \cdot \hat{n}$

$J_{\text{normal}} = \frac{-(1 + e)v_{\text{rel,normal}}}{(2/m)}$

$J_{\text{tangential}} = \min\left( \frac{\mu J_{\text{normal}}}{v_{\text{rel}}}, \frac{1}{7} \right)(-v_{\text{rel,tangential}})$

$\hat{n}$: normal unit vector along the line of centers.

$\hat{t}$: tangential unit vector perpendicular to $\hat{n}$.

#### cushion bounce

This is based on a paper by [Mathaven](https://billiards.colostate.edu/physics_articles/Mathavan_IMechE_2010.pdf). Many of the [figures](https://tailuge.github.io/billiards/dist/diagrams/mathaven.html) from the paper are recreated to confirm correctness.

Slip velocity at cushion contact point I

$$
ẋ_I = \dot{v_x} + \dot{\omega_y} R \sin \theta - \dot{\omega_z} R \cos \theta \qquad
ẏ'_I = -\dot{v_y} \sin \theta + \dot{\omega_x} R
$$

$$
\phi = \arctan\left(\frac{ẏ'_I}{ẋ_I}\right) \qquad
s = \sqrt{(ẋ_I)^2 + (ẏ'_I)^2}
$$

Slip velocity at table contact point C

$$
ẋ_C = \dot{v_x} - \dot{\omega_y} R \qquad
ẏ_C = \dot{v_y} + \dot{\omega_x} R
$$

$$
\phi' = \arctan\left(\frac{ẏ'_I}{ẋ_I}\right) \qquad
s' = \sqrt{(ẋ_C)^2 + (ẏ_C)^2}
$$

Numerical solutions for the centroid velocity of the ball during compression and resititution phases.

$$
(\dot{v_x})_{n+1} - (\dot{v_x})_n = - \frac{1}{M} \left[\mu_w \cos(\phi) + \mu_s \cos(\phi') \cdot (\sin \theta + \mu_w \sin(\phi) \cos \theta)\right] \Delta P_I
$$

$$
(\dot{v_y})_{n+1} - (\dot{v_y})_n  = - \frac{1}{M} \left[ \cos \theta - \mu_w \sin \theta \sin \phi + \mu_s \sin \phi' \cdot \left( \sin \theta + \mu_w \sin \phi \cos \theta \right) \right] \Delta P_I
$$

Numerical solutions for angular velocity of ball

$$
(\dot{\omega_x})_{n+1}−(\dot{\omega_x})_n = -\frac{5}{2MR}[\mu_w \sin(\phi) + \mu_s \sin(\phi') \times (\sin(\theta) + \mu_w \sin(\phi)\cos(\theta))]\Delta P_I
$$


$$
(\dot{\omega_y})_{n+1}−(\dot{\omega_y})_n = -\frac{5}{2MR}[\mu_w \cos(\phi)\sin(\theta) - \mu_s \cos(\phi') \times (\sin(\theta) + \mu_w \sin(\phi)\cos(\theta))]\Delta P_I
$$


$$
(\dot{\omega_z})_{n+1}−(\dot{\omega_z})_n = \frac{5}{2MR}(\mu_w \cos(\phi)\cos(\theta))\Delta P_I
$$

$`\theta`$ is a constant of the angle of cushion contact above ball centre with $`\sin(\theta) = 2/5`$. $`μ_s`$ is the coefficient of sliding friction  between the ball and table surface. $`μ_w`$ is the coefficient of sliding friction  between the ball and the cushion. 

Work done by the normal force at contact point $I$ along the $Z'$-axis which is aligned from the ball centre to I

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

Some of the Mathaven equations not supplied by the paper were inferred by LLMs and the [code](./src/model/physics/mathaven.ts) for them was initially generated by a combination of [Claude, Qwen and GPT-4o](./dist/diagrams/mathaven.md).

## Useful commands

### Install

```shell
nvm use v22.12.0
yarn install
yarn dev
yarn gltfpack
```

This generates artefacts in /dist for prod deployment (e.g. on github static pages)

### Run

```shell
yarn serve
```

Then open <http://localhost:8080/> in your browser to play

### Test

```shell
yarn test
yarn coverage
```

### Maintain

```shell
yarn deps
yarn upgrade -L
yarn prettify
```

### Two player

```shell
yarn serve
```

then open <http://localhost:8080/multi.html> to see options, message server is public nchan.

## Controls

Use mouse, touch screen or keyboard:

<kbd style="border: 1px solid #aaa; border-radius: 0.2em; padding: 0.1em 0.3em; font-size: 0.85em;">⇦</kbd>
<kbd style="border: 1px solid #aaa; border-radius: 0.2em; padding: 0.1em 0.3em; font-size: 0.85em;">⇨</kbd> Aim

<kbd style="border: 1px solid #aaa; border-radius: 0.2em; padding: 0.1em 0.3em; font-size: 0.85em;">Control</kbd>
<kbd style="border: 1px solid #aaa; border-radius: 0.2em; padding: 0.1em 0.3em; font-size: 0.85em;">⇦</kbd>
<kbd style="border: 1px solid #aaa; border-radius: 0.2em; padding: 0.1em 0.3em; font-size: 0.85em;">⇨</kbd> Fine aim

<kbd style="border: 1px solid #aaa; border-radius: 0.2em; padding: 0.1em 0.3em; font-size: 0.85em;">⇧</kbd>
<kbd style="border: 1px solid #aaa; border-radius: 0.2em; padding: 0.1em 0.3em; font-size: 0.85em;">⇩</kbd> Topspin and backspin

<kbd style="border: 1px solid #aaa; border-radius: 0.2em; padding: 0.1em 0.3em; font-size: 0.85em;">Shift</kbd>
<kbd style="border: 1px solid #aaa; border-radius: 0.2em; padding: 0.1em 0.3em; font-size: 0.85em;">⇦</kbd>
<kbd style="border: 1px solid #aaa; border-radius: 0.2em; padding: 0.1em 0.3em; font-size: 0.85em;">⇨</kbd> Side spin

<kbd style="border: 1px solid #aaa; border-radius: 0.2em; padding: 0.1em 0.3em; font-size: 0.85em;">Space</kbd> Hit - hold for more power

## Progress snapshots

July 2018

![2018](https://raw.githubusercontent.com/tailuge/billiards/master/dist/images/t1.png)

July 2019

![2019](https://raw.githubusercontent.com/tailuge/billiards/master/dist/images/t2.png)

March 2021

![2021](https://raw.githubusercontent.com/tailuge/billiards/master/dist/images/t3.png)

August 2023 (mobile)

top | aim  
:--:|:--:
<kbd>![2023](https://raw.githubusercontent.com/tailuge/billiards/master/dist/images/mobile1.jpg)</kbd> | <kbd>![2023](https://raw.githubusercontent.com/tailuge/billiards/master/dist/images/mobile2.jpg)</kbd>

Star History

[![Star History Chart](https://api.star-history.com/svg?repos=tailuge/billiards&type=Date)](https://star-history.com/#tailuge/billiards&Date)


## Licence 

This project is open source and licensed under the GNU General Public License - see the [LICENSE](LICENSE) file for details. Contributions welcome.



