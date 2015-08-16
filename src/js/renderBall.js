/**
 *
 * Rendered state of ball.
 *
 */

define([
    'src/js/mythree'
], function(THREE) {

    'use strict';

    var DETAIL = 16;

    /**
     *  Creates geometry and link to underlying ball object.
     */
    function RenderBall(ballref, colour) {

        this.ball = ballref;
        var texture = THREE.ImageUtils.loadTexture('img/whiteball.png');
        var geometry = new THREE.SphereGeometry(1, DETAIL, DETAIL);
        var material = new THREE.MeshPhongMaterial({
            ambient: 0x222222,
            color: colour,
            specular: 0xaaaaaa,
            shininess: 200,
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
     * Update rendered ball with underlying balls properties.
     */
    RenderBall.prototype.update = function(t) {
        this.ball.advance(t);
        this.group.position.copy(this.ball.pos);
        var axis = this.ball.rvel.clone();
        axis.normalize();
    };

    RenderBall.prototype.asString = function(v) {
        return "(" + v.x.toFixed(1) + "," + v.y.toFixed(1) + "," + v.z.toFixed(1) + ")";
    };

    return RenderBall;
});
