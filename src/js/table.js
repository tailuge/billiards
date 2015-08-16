/**
 * 
 * Table geometry and cushion collision helper methods.
 * 
 */

define( [
    'src/js/mythree'
], function(THREE) {

    'use strict';

    var ASPECT = 1.8;
    var BASE = 20.0;
    
    /**
     *  Constructor.
     */
    function Table() {
    }

    /**
     * Width, must adjust for ball radius(1) at some point. 
     */
     
    Table.prototype.getWidth = function() {
        return BASE*2;
    };

    Table.prototype.getLength = function() {
        return BASE*ASPECT*2;
    };
    

    /**
     * True when ball is travleing towards the cushion and beyond its extent.
     */
    Table.prototype.collidesWithE = function(ball) {
        return (ball.pos.x >= BASE) && (ball.vel.x > 0);
    };

    return Table;
});
