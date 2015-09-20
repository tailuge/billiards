/**
 * 
 * State of a ball.
 * 
 */

define([
    'src/js/mythree'
], function (THREE) {

    'use strict';

    var FRICTION_COEFF = 0.02;
    var SLIDING_COEFF = 0.23;
    var MIN_SPEED = 0.01;
    var DELTA_VEL_RVEL = 0.1;
    var UP = new THREE.Vector3(0, 0, 1);

    /**
     *  Constructor. Creates vectors.
     */
    function Ball() {
        this.pos = new THREE.Vector3(0, 0, 0);
        this.vel = new THREE.Vector3(0, 0, 0);
        this.rvel = new THREE.Vector3(0, 0, 0);
        this.state = "stationary";
    }

    /**
     * Speed. (magnitude of translational velocity)
     */
    Ball.prototype.speed = function () {
        return this.vel.length();
    };

    /**
     * Advance all properties by delta t.
     */
    Ball.prototype.advance = function (t) {
        if (this.checkStopped()) {
            this.state = "stationary";
            return;
        }
        if (this.isRolling()) {
            this.advanceRolling(t);
        }
        else {
            this.advanceSliding(t);
        }
    };

    Ball.prototype.naturalEqilibrium = function () {
        return (new THREE.Vector3()).crossVectors(this.rvel, UP).multiplyScalar(2.0 / 7.0).add(new THREE.Vector3().copy(this.vel).multiplyScalar(5.0 / 7.0));
    };

    Ball.prototype.changeToEquilibrium = function () {
        return this.naturalEqilibrium().sub(this.vel);
    };

    Ball.prototype.changeToAngularEquilibrium = function () {
        return (new THREE.Vector3()).crossVectors(this.naturalEqilibrium(), UP).sub(this.rvel);
    };

    /**
     * Acceleration
     */
    Ball.prototype.acceleration = function () {
        return this.changeToEquilibrium().normalize().multiplyScalar(-SLIDING_COEFF);
    };

    /**
     * Angular Acceleration
     */
    Ball.prototype.angularAcceleration = function () {
        return (new THREE.Vector3()).crossVectors(this.acceleration(), UP);
    };



    Ball.prototype.advanceSliding = function (t) {
        this.vel.add(this.changeToEquilibrium().multiplyScalar(t * SLIDING_COEFF));
        this.rvel.add((new THREE.Vector3()).crossVectors(this.changeToEquilibrium(), UP).multiplyScalar(SLIDING_COEFF * 5.0 * t / 2.0));
        this.pos.add(this.vel.clone().multiplyScalar(t));
        this.state = "sliding";
    };

    Ball.prototype.advanceRolling = function (t) {
        this.vel.add(this.vel.clone().normalize().multiplyScalar(-FRICTION_COEFF * t));
        this.rvel.copy(this.vel.clone().cross(UP).multiplyScalar(-1));
        this.pos.add(this.vel.clone().multiplyScalar(t));
        this.state = "rolling";
        return;
    };


    /**
     * Force due to friction opposing the translational motion.
     */
    Ball.prototype.angularAcceleration = function () {
        return (new THREE.Vector3()).crossVectors(this.vel, UP).normalize();
    };


    Ball.prototype.isRolling = function () {
        this.diff = (new THREE.Vector3()).crossVectors(this.rvel, UP).sub(this.vel).length();
        return this.diff < DELTA_VEL_RVEL;
    };

    /**
     * detect end of motion
     */
    Ball.prototype.checkStopped = function () {
        if ((this.vel.length() < MIN_SPEED) && (this.rvel.length() < MIN_SPEED)) {
            this.vel.set(0, 0, 0);
            this.rvel.set(0, 0, 0);
            return true;
        }
        return false;
    };

    /**
     * Force due to friction opposing the translational motion.
     */
    Ball.prototype.forceDueToSliding = function () {
        var acc = new THREE.Vector3();
        acc.copy(this.vel);
        acc.negate();
        acc.normalize();
        acc.multiplyScalar(FRICTION_COEFF);
        return acc;
    };

    /**
     * Force due to spining of ball.
     */
    Ball.prototype.forceDueToSpin = function () {
        var spinForce = this.spinForceDirection();
        spinForce.multiplyScalar(this.rvel.length() * 0.01);
        return spinForce;
    };

    /**
     * Normalised direction of force at contact point of ball and table
     * due to the rotation of the ball.
     * 
     * \frac{\vec{\omega} \times \vec{k}}{|\vec{\omega} \times \vec{k}|}
     */
    Ball.prototype.spinForceDirection = function () {
        var f = new THREE.Vector3();
        f.crossVectors(this.rvel, UP);
        f.normalize();
        return f;
    };

    return Ball;
});
