/**
 *
 * Rendered state of ball.
 *
 */

define([
    'src/js/mythree',
    'src/js/arrow',
    'src/js/text'
], function(THREE, Arrow, Text) {

    'use strict';

    var DETAIL = 16;

    /**
     *  Creates geometry and link to underlying ball object.
     */
    function RenderBall(ballref, colour) {

        this.ball = ballref;
        var texture = THREE.ImageUtils.loadTexture('img/whiteball.jpg');
        var geometry = new THREE.SphereGeometry(1, DETAIL, DETAIL);
        var material = new THREE.MeshPhongMaterial({
            ambient: 0x222222,
            color: colour,
            specular: 0xaaaaaa,
            shininess: 300,
            shading: THREE.SmoothShading,
            map: texture
        });

        this.ballMesh = new THREE.Mesh(geometry, material);
        this.ballMesh.castShadow = true;

        this.group = new THREE.Object3D();
        this.group.add(this.ballMesh);
        this.group.position.copy(this.ball.pos);
    }

    /**
     * return the mesh (for addition to scene).
     */
    RenderBall.prototype.getMesh = function() {
        return this.group;
    };

    /**
     * Add debug arrows.
     */
    RenderBall.prototype.debug = function() {
        this.velArrow = new Arrow(0xff0000);
        this.rvelArrow = new Arrow(0xffff00);
        this.group.add(this.velArrow.getArrowHelper());
        this.group.add(this.rvelArrow.getArrowHelper());
    };

    /**
     * Update rendered ball with underlying balls properties.
     */
    RenderBall.prototype.update = function(t) {
        this.ball.advance(t);
        this.group.position.copy(this.ball.pos);
        var axis = this.ball.rvel.clone();
        axis.normalize();
        this.ballMesh.rotateOnAxis(axis, 0.01);
        this.velArrow.update(this.ball.vel);
        this.rvelArrow.update(this.ball.rvel);

        if (this.velText) {
            this.group.remove(this.velText);
        }

        this.velText = new Text("v" + this.asString(this.ball.vel) + " r" + this.asString(this.ball.rvel));
        this.velText.position.set(0,0,1);
        this.group.add(this.velText);
    };

    RenderBall.prototype.asString = function(v) {
        return "(" + v.x.toFixed(2) + "," + v.y.toFixed(2) + "," + v.z.toFixed(2) + ")";
    };

    return RenderBall;
});
