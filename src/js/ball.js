/**
 * 
 * State of a ball.
 * 
 */

define( [
    'src/js/mythree'
], function(THREE) {

    'use strict';

    var MIN_SPEED = 0.1;
    
    /**
     *  Constructor. Creates vectors.
     */
    function Ball() {
        this.pos = new THREE.Vector3(0, 0, 0);
        this.vel = new THREE.Vector3(0, 0, 0);
        this.rvel = new THREE.Vector3(0, 0, 0);
    }

    /**
     * Speed. (magnitude of translational velocity)
     */
    Ball.prototype.speed = function() {
        return this.vel.length();
    };

    /**
     * Advance all properties by delta t.
     */
    Ball.prototype.advance = function(t) {
        this.vel.add(this.acceleration());
        this.pos.add(this.vel.clone().multiplyScalar(t));
        this.checkStopped();
    };

    /**
     * detect end of motion
     */
    Ball.prototype.checkStopped = function() {
        if ((this.vel.length() < MIN_SPEED) && (this.rvel.length() < MIN_SPEED)) {
            this.vel.set(0,0,0);
        }
    };
     
     
    /**
     * Acceleration
     */ 
    Ball.prototype.acceleration = function() {
        var slidingForce = this.forceDueToSliding();
        var spinForce = this.forceDueToSpin();
        var combined = (new THREE.Vector3()).addVectors(slidingForce,spinForce);
        return combined;
    };

    /**
     * Force due to friction opposing the translational motion.
     */ 
    Ball.prototype.forceDueToSliding = function() {
        var acc = new THREE.Vector3();
        acc.copy(this.vel);
        acc.negate();
        acc.normalize();
        acc.multiplyScalar(0.01);
        return acc;
    };

    /**
     * Force due to spining of ball.
     */ 
    Ball.prototype.forceDueToSpin = function() {
        var spinForce = this.spinForceDirection();
        spinForce.multiplyScalar(0.01);
        return spinForce;
    };

    /**
     * Normalised direction of force at contact point of ball and table
     * due to the rotation of the ball.
     * 
     * \frac{\vec{\omega} \times \vec{k}}{|\vec{\omega} \times \vec{k}|}
     */ 
    Ball.prototype.spinForceDirection = function() {
        var up = new THREE.Vector3(0,0,1);
        var f = new THREE.Vector3();
        f.crossVectors(this.rvel,up);
        f.normalize();
        return f;
    };

    return Ball;
});
