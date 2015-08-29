/* globals it,describe,beforeEach,expect */

'use strict';

define(['../src/js/table', '../src/js/cushion', '../src/js/ball'], function(Table, Cushion, Ball) {

  describe('Cushion Tests', function() {
    var table;
    var ball;
    var cushion;
    
    beforeEach(function() {
      table = new Table();
      ball = new Ball();
      cushion = new Cushion();
    });

    it('object can be created', function() {
      expect(table).toBeDefined();
      expect(ball).toBeDefined();
      expect(cushion).toBeDefined();
    });

    it('collision reversed velocity', function() {
      ball.vel.setX(1);
      ball.rvel.setX(1);
      cushion.collideWithX(ball);
      expect(ball.vel.x).toBeLessThan(0);
    });

    it('collision does not reverse spin', function() {
      ball.vel.setX(1);
      ball.rvel.setX(1);
      cushion.collideWithX(ball);
      expect(ball.rvel.x).toBeGreaterThan(0);
    });


  });

});
