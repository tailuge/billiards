/* globals it,describe,beforeEach,expect */

'use strict';

define(['../src/js/arrow'], function(Arrow) {

    describe('Arrow Tests', function() {
        var arrow;
        
        beforeEach(function() {
            arrow = new Arrow();
        });

        it('object can be created', function() {
            expect(arrow).toBeDefined();
        });

//        it('arrow can update', function() {
  //          arrow.update(new THREE.Vector3(1,0,0));
    //        expect(ball.pos.length()).toEqual(0.0);
      //  });


    });

});
