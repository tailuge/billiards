/* globals it,describe,beforeEach,expect */

'use strict';

define(['../src/js/ball', '../src/js/mythree.js'], function (Ball, THREE) {

    describe('Ball Tests', function () {
        var ball;

        beforeEach(function () {
            ball = new Ball();
        });

        it('object can be created', function () {
            expect(ball).toBeDefined();
        });

        it('stationary ball doesnt move', function () {
            ball.advance(0.1);
            expect(ball.pos.length()).toEqual(0.0);
        });

        it('ball with velocity moves', function () {
            ball.vel.setX(1.0);
            ball.advance(0.1);
            expect(ball.pos.length()).not.toEqual(0.0);
        });

        it('ball with low speed stops', function () {
            ball.vel.setX(0.001);
            ball.advance(0.1);
            expect(ball.speed()).toBeCloseTo(0, 5);
        });

        it('spinning ball begins to move', function () {
            ball.rvel.setX(1);
            ball.advance(0.1);
//            console.log(JSON.stringify(ball.naturalEqilibrium()));
            expect(ball.speed()).not.toEqual(0.0);
        });

        it('detect ball is rolling', function () {
            ball.rvel.setX(-1);
            ball.vel.setY(1);
            expect(ball.isRolling()).toBeTruthy();
        });

        it('rolling ball should stay rolling', function () {
            ball.rvel.setX(-1);
            ball.vel.setY(1);
            ball.advance(0.1);
            expect(ball.isRolling()).toBeTruthy();
        });

        it('a ball close to rolling would be in equlibrium', function () {
            ball.rvel.setX(-1);
            ball.vel.setY(1);
            expect(ball.naturalEqilibrium().length()).toBeCloseTo(1, 5);
        });

        it('equilibrium target should remain after advancing time', function () {
            ball.rvel.setY(0.5);
            var initVel = new THREE.Vector3(1, 0, 0);
            ball.vel.copy(initVel);
            expect(ball.isRolling()).not.toBeTruthy();
            var before = ball.naturalEqilibrium();
            ball.advanceSliding(0.1);
            expect(before.length()).toBeCloseTo(ball.naturalEqilibrium().length(),2);
        });

        
        it('a ball in equilibrium would remain so when advanced', function () {
            ball.rvel.setX(-1);
            ball.vel.setY(1);
            ball.advanceSliding(0.1);
            expect(ball.naturalEqilibrium().length()).toBeCloseTo(1, 5);
        });

    });

});
