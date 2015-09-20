/**
 * 
 * Table geometry and cushion collision helper methods.
 * 
 */

define([
    'src/js/mythree',
    'src/js/cushion'
], function(THREE, Cushion) {

    'use strict';

    var ASPECT = 1.8;
    var BASE = 10.0;
    var UP = new THREE.Vector3(0, 0, 1);

    var cushion = new Cushion();
    var self = this;
    
    /**
     *  Constructor.
     */
    function Table() {
        self = this;
    }

    /**
     * Width, must adjust for ball radius(1) at some point. 
     */

    Table.prototype.getWidth = function() {
        return BASE * 2;
    };

    Table.prototype.getLength = function() {
        return BASE * ASPECT * 2;
    };


    /**
     * True when ball is traveling towards the cushion and beyond its extent.
     */
    Table.prototype.collidesWithX = function(ball) {
        return ((ball.pos.x >= BASE) && (ball.vel.x > 0)) ||
            ((ball.pos.x <= -BASE) && (ball.vel.x < 0));
    };

    Table.prototype.collidesWithY = function(ball) {
        return ((ball.pos.y >= BASE * ASPECT) && (ball.vel.y > 0)) ||
            ((ball.pos.y <= -BASE * ASPECT) && (ball.vel.y < 0));
    };

    /**
     * Update ball if it collides with cushion. 
     */
    Table.prototype.bounceCushions = function(ball) {
        if (self.collidesWithX(ball)) {
            cushion.collideWithX(ball);
        }
        if (self.collidesWithY(ball)) {
            cushion.collideWithY(ball);
        }
    };
    
    /**
     * Update 2 balls if they are in collision.
     */
    Table.prototype.collideBalls = function (a, b) {

        // can only collide if seperation is less than 2 radii

        if (a.pos.distanceTo(b.pos) > 2.0) {
            return false;
        }
        
        
        var relativeVelocity = (new THREE.Vector3()).subVectors(a.vel,b.vel);
        var centers = (new THREE.Vector3()).subVectors(b.pos,a.pos);
        centers.normalize();
        var perpendicular = (new THREE.Vector3()).crossVectors(centers,UP);

        var vDotCenters = centers.dot(relativeVelocity);
        var vDotPerpendicular = perpendicular.dot(relativeVelocity);
        
        // only collide if balls are moving towards each other along the line connecting centres
        
        if (vDotCenters <= 0) {
            return false;
        }

        // do calculation relative to the motion of b

        var u = (new THREE.Vector3()).copy(b.vel);
        
        a.vel.sub(u);
        b.vel.set(0,0,0);

        var deltaVcenters = centers.multiplyScalar(vDotCenters);
        var deltaVperpendicular = perpendicular.multiplyScalar(vDotPerpendicular);
        
        b.vel.copy(deltaVcenters);
        a.vel.copy(deltaVperpendicular);
        
        // return to table relative motion
        a.vel.add(u);
        b.vel.add(u);
        
//        console.log("U: "+JSON.stringify(u));
        return true;
    };

    return Table;
});
