# billiards
[![Build Status](https://travis-ci.org/tailuge/billiards.svg?branch=master)](https://travis-ci.org/tailuge/billiards/) [![Coverage Status](https://coveralls.io/repos/github/tailuge/billiards/badge.svg?branch=master)](https://coveralls.io/github/tailuge/billiards?branch=master) [![Dependency Status](https://david-dm.org/tailuge/billiards.svg)](https://david-dm.org/tailuge/billiards) [![devDependency Status](https://david-dm.org/tailuge/billiards/dev-status.svg)](https://david-dm.org/tailuge/billiards#info=devDependencies) [![CodeFactor](https://www.codefactor.io/repository/github/tailuge/billiards/badge)](https://www.codefactor.io/repository/github/tailuge/billiards) [![Open in Gitpod](https://img.shields.io/badge/Gitpod-Open%20in%20Gitpod-%230092CF.svg)](https://gitpod.io/#https://github.com/tailuge/billiards)


Unsophisticated billiards physics.

### Demo

In browser WebGL [demo](http://tailuge.github.io/billiards/dist)


### Setup

```
nvm use v10.15.3
yarn install
yarn dev
```
### Test

```
yarn test
yarn coverage
yarn server
yarn deps
yarn upgrade -L
yarn prettify
```


### Reference

3D graphics uses [three.js](https://threejs.org/docs/index.html#api/math/Vector3)

Papers on [ball mechanics](https://billiards.colostate.edu/physics_articles/Han_paper.pdf), [cushions](https://billiards.colostate.edu/physics/Mathavan_IMechE_2010.pdf)
and [max spin](https://billiards.colostate.edu/technical_proofs/new/TP_B-17.pdf)

Inline <a href="https://www.codecogs.com/eqnedit.php?latex=\dot{a}" target="_blank">LaTeX</a> editor

### Key equations

##### surface velocity [:page_with_curl:](https://github.com/tailuge/billiards/blob/master/src/physics.ts#L11-L16)


![equation](http://latex.codecogs.com/png.latex?\vec{v{_{a}}}%20=%20\vec{v}+%20(\vec{up}%20\times%20\vec{\omega}))


##### rolling motion [:page_with_curl:](https://github.com/tailuge/billiards/blob/master/src/physics.ts#L35-L40)


![equation](http://latex.codecogs.com/png.latex?\dot{v}%20=%20-\mu%20g%20\frac{\vec{v}}{\left%20|%20\vec{v}%20\right%20|})

![equation](http://latex.codecogs.com/png.latex?\dot{w}%20=%20-\frac{5}{2}\frac{\mu%20g}{R}%20\frac{\vec{v}}{\left%20|%20\vec{v}%20\right%20|})

![equation](http://latex.codecogs.com/png.latex?\dot{\omega}_{z}%20=%20-\frac{5}{2}\frac{M_{z}}{mR^2}sgn(\omega_{z}))



##### sliding motion [:page_with_curl:](https://github.com/tailuge/billiards/blob/master/src/physics.ts#L18-L23)


![equation](http://latex.codecogs.com/png.latex?\dot{v}%20=%20-\frac{5}{7}\frac{M_{xy}}{mR}\frac{\vec{up}\times\vec{\omega}}{\left%20|%20\vec{w}%20\right%20|})

![equation](http://latex.codecogs.com/png.latex?\dot{w}%20=%20-\frac{5}{7}\frac{M_{xy}}{mR^2}\frac{\vec{\omega}}{\left%20|%20\vec{w}%20\right%20|})


##### cushion bounce [:page_with_curl:](https://github.com/tailuge/billiards/blob/master/src/physics.ts#L56-L105)


<a href="https://www.codecogs.com/eqnedit.php?latex=\dot{v}_{x}&space;=&space;-v_{x0}(\frac{2}{7}sin^2\theta_{a}&space;&plus;&space;(1&plus;e)cos^2\theta_{a})-R\omega_{y0}sin\theta_{a}" target="_blank"><img src="https://latex.codecogs.com/gif.latex?\dot{v}_{x}&space;=&space;-v_{x0}(\frac{2}{7}sin^2\theta_{a}&space;&plus;&space;(1&plus;e)cos^2\theta_{a})-R\omega_{y0}sin\theta_{a}" title="\dot{v}_{x} = -v_{x0}(\frac{2}{7}sin^2\theta_{a} + (1+e)cos^2\theta_{a})-R\omega_{y0}sin\theta_{a}" /></a>

<a href="https://www.codecogs.com/eqnedit.php?latex=\dot{v}_{y}&space;=&space;\frac{2}{7}v_{y0}&plus;\frac{2}{7}R(\omega_{x0}sin\theta_{a}&space;-&space;\omega_{z0}cos\theta_{a})&space;-&space;v_{y0}" target="_blank"><img src="https://latex.codecogs.com/gif.latex?\dot{v}_{y}&space;=&space;\frac{2}{7}v_{y0}&plus;\frac{2}{7}R(\omega_{x0}sin\theta_{a}&space;-&space;\omega_{z0}cos\theta_{a})&space;-&space;v_{y0}" title="\dot{v}_{y} = \frac{2}{7}v_{y0}+\frac{2}{7}R(\omega_{x0}sin\theta_{a} - \omega_{z0}cos\theta_{a}) - v_{y0}" /></a>

<a href="https://www.codecogs.com/eqnedit.php?latex=\dot{\omega_x}&space;=&space;\frac{5S_y_0}{2mRA}sin\theta_a" target="_blank"><img src="https://latex.codecogs.com/gif.latex?\dot{\omega_x}&space;=&space;\frac{5S_y_0}{2mRA}sin\theta_a" title="\dot{\omega_x} = \frac{5S_y_0}{2mRA}sin\theta_a" /></a>

<a href="https://www.codecogs.com/eqnedit.php?latex=\dot{\omega_y}&space;=&space;\frac{5}{2mR}\Big(\frac{-S_x_0}{A}&space;&plus;&space;sin\theta_a&space;\frac{C_0}{B}(1&plus;e)(cos\theta_a-sin\theta_a)\Big)" target="_blank"><img src="https://latex.codecogs.com/gif.latex?\dot{\omega_y}&space;=&space;\frac{5}{2mR}\Big(\frac{-S_x_0}{A}&space;&plus;&space;sin\theta_a&space;\frac{C_0}{B}(1&plus;e)(cos\theta_a-sin\theta_a)\Big)" title="\dot{\omega_y} = \frac{5}{2mR}\Big(\frac{-S_x_0}{A} + sin\theta_a \frac{C_0}{B}(1+e)(cos\theta_a-sin\theta_a)\Big)" /></a>

<a href="https://www.codecogs.com/eqnedit.php?latex=\dot{\omega_z}&space;=&space;\frac{5S_y_0}{2mRA}cos\theta_a" target="_blank"><img src="https://latex.codecogs.com/gif.latex?\dot{\omega_z}&space;=&space;\frac{5S_y_0}{2mRA}cos\theta_a" title="\dot{\omega_z} = \frac{5S_y_0}{2mRA}cos\theta_a" /></a>


### Progress snapshots

July 2018

<img src="https://raw.githubusercontent.com/tailuge/billiards/master/dist/t1.png">