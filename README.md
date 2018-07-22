# billiards [![Build Status](https://travis-ci.org/tailuge/billiards.svg?branch=master)](https://travis-ci.org/tailuge/billiards/) [![Coverage Status](https://coveralls.io/repos/github/tailuge/billiards/badge.svg?branch=master)](https://coveralls.io/github/tailuge/billiards?branch=master) [![Dependency Status](https://david-dm.org/tailuge/billiards.svg)](https://david-dm.org/tailuge/billiards) [![devDependency Status](https://david-dm.org/tailuge/billiards/dev-status.svg)](https://david-dm.org/tailuge/billiards#info=devDependencies) [![CodeFactor](https://www.codefactor.io/repository/github/tailuge/billiards/badge)](https://www.codefactor.io/repository/github/tailuge/billiards)


Unsophisticated billiards physics.



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

### Demo

In browser WebGL [demo](http://tailuge.github.io/billiards/)

[Edit](https://ide.c9.io/tailuge/billiards) and compile in browser on cloud9


###### Reference

3D graphics uses [three.js](https://threejs.org/docs/index.html#api/math/Vector3)

Papers on [ball mechanics](http://billiards.colostate.edu/physics/Han_paper.pdf)
and [max spin](http://billiards.colostate.edu/technical_proofs/new/TP_B-17.pdf)

surface velocity at contact point of ball on table

![equation](http://latex.codecogs.com/png.latex?\vec{v{_{a}}}%20=%20\vec{v}\cdot%20(\vec{z}%20\times%20\vec{\omega})) 

https://github.com/tailuge/billiards/blob/master/src/physics.ts#L11-L16

rolling motion

![equation](http://latex.codecogs.com/png.latex?{v}%27%20=%20-\mu%20g%20\frac{\vec{v}}{\left%20|%20\vec{v}%20\right%20|}) 

sliding motion

### Progress snapshots

July 2018

<img src="https://raw.githubusercontent.com/tailuge/billiards/master/dist/t1.png">