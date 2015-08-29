/**
 * 
 * Table geometry and cushion collision helper methods.
 * 
 */

define([
    'src/js/mythree'
], function(THREE) {

    'use strict';

    var ASPECT = 1.8;
    var BASE = 10.0;

    /**
     *  Constructor.
     */
    function Table() {}

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
        return ((ball.pos.x >= BASE)  && (ball.vel.x > 0)) ||
               ((ball.pos.x <= -BASE) && (ball.vel.x < 0));
    };

    Table.prototype.collidesWithY = function(ball) {
        return ((ball.pos.y >= BASE * ASPECT)  && (ball.vel.y > 0)) ||
               ((ball.pos.y <= -BASE * ASPECT) && (ball.vel.y < 0));
    };

    return Table;
});
