# billiards

[![codecov](https://codecov.io/gh/tailuge/billiards/branch/master/graph/badge.svg?token=BH11KRAEL0)](https://codecov.io/gh/tailuge/billiards)
[![CodeFactor](https://www.codefactor.io/repository/github/tailuge/billiards/badge)](https://www.codefactor.io/repository/github/tailuge/billiards)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=tailuge_billiards&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=tailuge_billiards)
[![Tests](https://github.com/tailuge/billiards/actions/workflows/main.yml/badge.svg)](https://github.com/tailuge/billiards/actions/workflows/main.yml)
[![Open in Gitpod](https://img.shields.io/badge/Gitpod-Open%20in%20Gitpod-%230092CF.svg)](https://gitpod.io/#https://github.com/tailuge/billiards)

## Features

Unsophisticated billiards with spinning ball physics written in typescript.

* Backspin and sidespin well modeled.
* Presentation using WebGL in any modern browser or mobile.
* Record and playback breaks.
* Two player online mode with node websocket server.
* Nine ball and three cushion billiards rules

## Online Demo

[![Demo](https://raw.githubusercontent.com/tailuge/billiards/master/dist/images/t3.png)](https://tailuge.github.io/billiards/dist)

Demos run in all major browsers and use WebGL

* [Nine ball ⬀](https://tailuge.github.io/billiards/dist)
* 4-ball [Straight pool ⬀](https://tailuge.github.io/billiards/dist?ruletype=fourteenone).
* 6-red [Snooker ⬀](https://tailuge.github.io/billiards/dist?ruletype=snooker).
* [Three cushion billiards ⬀](https://tailuge.github.io/billiards/dist?ruletype=threecushion).
* Inspect physics using [diagrams](https://tailuge.github.io/billiards/dist/diagrams/diagrams.html).
* Compare highest [breaks](https://tailuge-billiards.cyclic.app/)
* Try [two player](https://tailuge.github.io/billiards/dist/lobby/lobby.html) online hosted on render.com

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

#### cushion bounce

<a href="https://www.codecogs.com/eqnedit.php?latex=\dot{v}_{x}&space;=&space;-v_{x0}(\frac{2}{7}sin^2\theta_{a}&space;&plus;&space;(1&plus;e)cos^2\theta_{a})-R\omega_{y0}sin\theta_{a}" target="_blank"><img src="https://latex.codecogs.com/gif.latex?\dot{v}_{x}&space;=&space;-v_{x0}(\frac{2}{7}sin^2\theta_{a}&space;&plus;&space;(1&plus;e)cos^2\theta_{a})-R\omega_{y0}sin\theta_{a}" title="\dot{v}_{x} = -v_{x0}(\frac{2}{7}sin^2\theta_{a} + (1+e)cos^2\theta_{a})-R\omega_{y0}sin\theta_{a}" /></a>

<a href="https://www.codecogs.com/eqnedit.php?latex=\dot{v}_{y}&space;=&space;\frac{2}{7}v_{y0}&plus;\frac{2}{7}R(\omega_{x0}sin\theta_{a}&space;-&space;\omega_{z0}cos\theta_{a})&space;-&space;v_{y0}" target="_blank"><img src="https://latex.codecogs.com/gif.latex?\dot{v}_{y}&space;=&space;\frac{2}{7}v_{y0}&plus;\frac{2}{7}R(\omega_{x0}sin\theta_{a}&space;-&space;\omega_{z0}cos\theta_{a})&space;-&space;v_{y0}" title="\dot{v}_{y} = \frac{2}{7}v_{y0}+\frac{2}{7}R(\omega_{x0}sin\theta_{a} - \omega_{z0}cos\theta_{a}) - v_{y0}" /></a>

<a href="https://www.codecogs.com/eqnedit.php?latex=\dot{\omega_x}&space;=&space;\frac{5S_y_0}{2mRA}sin\theta_a" target="_blank"><img src="https://latex.codecogs.com/gif.latex?\dot{\omega_x}&space;=&space;\frac{5S_y_0}{2mRA}sin\theta_a" title="\dot{\omega_x} = \frac{5S_y_0}{2mRA}sin\theta_a" /></a>

<a href="https://www.codecogs.com/eqnedit.php?latex=\dot{\omega_y}&space;=&space;\frac{5}{2mR}\Big(\frac{-S_x_0}{A}&space;&plus;&space;sin\theta_a&space;\frac{C_0}{B}(1&plus;e)(cos\theta_a-sin\theta_a)\Big)" target="_blank"><img src="https://latex.codecogs.com/gif.latex?\dot{\omega_y}&space;=&space;\frac{5}{2mR}\Big(\frac{-S_x_0}{A}&space;&plus;&space;sin\theta_a&space;\frac{C_0}{B}(1&plus;e)(cos\theta_a-sin\theta_a)\Big)" title="\dot{\omega_y} = \frac{5}{2mR}\Big(\frac{-S_x_0}{A} + sin\theta_a \frac{C_0}{B}(1+e)(cos\theta_a-sin\theta_a)\Big)" /></a>

<a href="https://www.codecogs.com/eqnedit.php?latex=\dot{\omega_z}&space;=&space;\frac{5S_y_0}{2mRA}cos\theta_a" target="_blank"><img src="https://latex.codecogs.com/gif.latex?\dot{\omega_z}&space;=&space;\frac{5S_y_0}{2mRA}cos\theta_a" title="\dot{\omega_z} = \frac{5S_y_0}{2mRA}cos\theta_a" /></a>

## Useful commands

### Install

```shell
nvm use v18.17.1
yarn install
yarn dev
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
yarn websocket
```

the client uses query parameter ``?websocketserver=wss://some-host`` to locate
a websocket server, open <http://localhost:8888/dist/multi.html> to see options

## Controls

Use mouse or keyboard:

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

