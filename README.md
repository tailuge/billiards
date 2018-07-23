# billiards [![Build Status](https://travis-ci.org/tailuge/billiards.svg?branch=master)](https://travis-ci.org/tailuge/billiards/) [![Coverage Status](https://coveralls.io/repos/github/tailuge/billiards/badge.svg?branch=master)](https://coveralls.io/github/tailuge/billiards?branch=master) [![Dependency Status](https://david-dm.org/tailuge/billiards.svg)](https://david-dm.org/tailuge/billiards) [![devDependency Status](https://david-dm.org/tailuge/billiards/dev-status.svg)](https://david-dm.org/tailuge/billiards#info=devDependencies) [![CodeFactor](https://www.codefactor.io/repository/github/tailuge/billiards/badge)](https://www.codefactor.io/repository/github/tailuge/billiards)


Unsophisticated billiards physics.

### Demo

In browser WebGL [demo](http://tailuge.github.io/billiards/)


### Setup

```
nvm use v9.11.1
npm install gulp-cli -g
yarn install
yarn watch 
```
### Test

```
yarn test
```

[Edit](https://ide.c9.io/tailuge/billiards) and compile in browser on cloud9


### Reference

3D graphics uses [three.js](https://threejs.org/docs/index.html#api/math/Vector3)

Papers on [ball mechanics](http://billiards.colostate.edu/physics/Han_paper.pdf)
and [max spin](http://billiards.colostate.edu/technical_proofs/new/TP_B-17.pdf)

### Key equations

surface velocity at contact point of ball on table

![equation](http://latex.codecogs.com/png.latex?\vec{v{_{a}}}%20=%20\vec{v}\cdot%20(\vec{z}%20\times%20\vec{\omega})) 

[code](https://github.com/tailuge/billiards/blob/master/src/physics.ts#L11-L16)

rolling motion

![equation](http://latex.codecogs.com/png.latex?\dot{v}%20=%20-\mu%20g%20\frac{\vec{v}}{\left%20|%20\vec{v}%20\right%20|}) 

![equation](http://latex.codecogs.com/png.latex?\dot{w}%20=%20-\frac{5}{2}\frac{\mu%20g}{R}%20\frac{\vec{v}}{\left%20|%20\vec{v}%20\right%20|}) 

![equation](http://latex.codecogs.com/png.latex?\dot{\omega}_{z}%20=%20-\frac{5}{2}\frac{M_{z}}{mR^2}sgn(\omega_{z}))

[code](https://github.com/tailuge/billiards/blob/master/src/physics.ts#L35-L40)

sliding motion

![equation](http://latex.codecogs.com/png.latex?\dot{v}%20=%20-\frac{5}{7}\frac{M_{xy}}{mR}\vec{z}\times\vec{\omega})

![equation](http://latex.codecogs.com/png.latex?\dot{w}%20=%20-\frac{5}{7}\frac{M_{xy}}{mR^2}\vec{\omega})

[code](https://github.com/tailuge/billiards/blob/master/src/physics.ts#L18-L23)

### Progress snapshots

July 2018

<img src="https://raw.githubusercontent.com/tailuge/billiards/master/dist/t1.png">