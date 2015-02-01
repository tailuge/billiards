/* globals it,describe,beforeEach,expect */

'use strict';

define(['src/ball'], function(Ball) {

    describe('Ball Tests', function() {
        var ball;
        
        beforeEach(function() {
            ball = new Ball();
        });

        it('object can be created', function() {
            expect(ball).toBeDefined();
        });

        it('stationary ball doesnt move', function() {
            ball.advance(0.1);
            expect(ball.pos.length()).toEqual(0.0);
        });

        it('stationary ball has no acceleration', function() {
            expect(ball.acceleration().length()).toEqual(0.0);
        });

        it('ball with velocity moves', function() {
            ball.vel.setX(1.0);
            ball.advance(0.1);
            expect(ball.pos.length()).not.toEqual(0.0);
        });

        it('ball with low speed stops', function() {
            ball.vel.setX(0.01);
            ball.advance(0.1);
            expect(ball.vel.length()).toEqual(0.0);
        });

        it('spinning ball force is normalised', function() {
            ball.rvel.setX(1);
            var f = ball.spinForceDirection(); 
            expect(f.length()).toEqual(1);
        });


    });

});
