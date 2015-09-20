/* globals it,describe,beforeEach,expect */

'use strict';

define(['../src/js/table', '../src/js/ball'], function(Table, Ball) {

  describe('Table Tests', function() {
    var table;
    var ball;

    beforeEach(function() {
      table = new Table();
      ball = new Ball();
    });

    it('object can be created', function() {
      expect(table).toBeDefined();
      expect(ball).toBeDefined();
    });

    it('collision computed for cushions', function() {
      ball.pos.setX(table.getWidth() / 2 - 0.1);
      ball.vel.setX(0.1);
      expect(table.collidesWithX(ball)).not.toBeTruthy();
      
      ball.pos.setX(table.getWidth() / 2);
      ball.vel.setX(0.1);
      expect(table.collidesWithX(ball)).toBeTruthy();
      
      ball.pos.setX(table.getWidth() / 2 + 0.1);
      ball.vel.setX(0.1);
      expect(table.collidesWithX(ball)).toBeTruthy();
    });

    it('does not collide when travelling away from cushion', function() {
      ball.pos.setX(table.getWidth() / 2 + 0.1);
      ball.vel.setX(-0.1);
      expect(table.collidesWithX(ball)).not.toBeTruthy();
    });

    it('two balls apart do not collide', function() {
      var a = new Ball();
      var b = new Ball();
      a.pos.set(0,0,0);
      b.pos.set(0,2.1,0);
      a.vel.set(0,1,0);
      expect(table.collideBalls(a,b)).not.toBeTruthy();
    });

    it('two balls traveling apart to not collide', function() {
      var a = new Ball();
      var b = new Ball();
      a.pos.set(0,0,0);
      b.pos.set(0,1.9,0);
      a.vel.set(0,-1,0);
      expect(table.collideBalls(b,a)).not.toBeTruthy();
    });

    it('two balls close collide', function() {
      var a = new Ball();
      var b = new Ball();
      a.pos.set(0,0,0);
      b.pos.set(0,1.9,0);
      a.vel.set(0,1,0);
      expect(table.collideBalls(a,b)).toBeTruthy();
      expect(b.vel.y).toBeCloseTo(1,1);
    });

    it('two balls do not recollide immediately after colliding', function() {
      var a = new Ball();
      var b = new Ball();
      a.pos.set(0,0,0);
      b.pos.set(0,1.9,0);
      a.vel.set(0,1,0);
      expect(table.collideBalls(a,b)).toBeTruthy();
      expect(table.collideBalls(a,b)).not.toBeTruthy();
    });

    it('two balls close collide at 45 degrees', function() {
      var a = new Ball();
      var b = new Ball();
      a.pos.set(0,0,0);
      b.pos.set(1.4,1.4,0);
      a.vel.set(0,1,0);
      expect(table.collideBalls(a,b)).toBeTruthy();
      expect(b.vel.x).toBeCloseTo(0.5,1);
      expect(b.vel.y).toBeCloseTo(0.5,1);
      expect(a.vel.x).toBeCloseTo(-0.5,1);
      expect(a.vel.y).toBeCloseTo(0.5,1); 
    });

    it('two balls both moving collide at 45 degrees', function() {
      var a = new Ball();
      var b = new Ball();
      a.pos.set(0,0,0);
      b.pos.set(1.4,1.4,0);
      a.vel.set(0,0.5,0);
      b.vel.set(0,-0.5,0);
      expect(table.collideBalls(a,b)).toBeTruthy();
//      console.log(JSON.stringify(a, null, 2));
//      console.log(JSON.stringify(b, null, 2));
    });


  });

});
