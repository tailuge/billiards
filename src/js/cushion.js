/**
 * 
 * Cushion collision helper class
 * 
 */

define( [
    'src/js/mythree'
], function(THREE) {

    'use strict';

    var VEL_COEF = 0.8;
    var SPIN_COEF = 0.5;
    /**
     * Constructor.
     */
    function Cushion() {
    }

    /**
     * Update ball with new velocity after collision with cushion in X direction.
     */
    Cushion.prototype.collideWithX = function(ball) {
        ball.vel.x *= -VEL_COEF;
        ball.rvel.x *= SPIN_COEF;
        return ball;
    };

    return Cushion;
});
