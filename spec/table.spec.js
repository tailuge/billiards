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
      expect(table.collidesWithE(ball)).not.toBeTruthy();
      
      ball.pos.setX(table.getWidth() / 2);
      ball.vel.setX(0.1);
      expect(table.collidesWithE(ball)).toBeTruthy();
      
      ball.pos.setX(table.getWidth() / 2 + 0.1);
      ball.vel.setX(0.1);
      expect(table.collidesWithE(ball)).toBeTruthy();
    });

    it('does not collide when travelling away from cushion', function() {
      ball.pos.setX(table.getWidth() / 2 + 0.1);
      ball.vel.setX(-0.1);
      expect(table.collidesWithE(ball)).not.toBeTruthy();
    });


  });

});
