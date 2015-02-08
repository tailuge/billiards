/**
 *
 * Rendered state of ball.
 *
 */

define([
    'src/js/mythree',
    'src/js/arrow'
], function(THREE, Arrow) {

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
        var dir = new THREE.Vector3(4, 0, 0);
        var origin = new THREE.Vector3(0, 0, 0);
        var hex = 0xff0000;

        var arrow = new Arrow(dir, origin, hex);
        this.group.add(arrow.getArrowHelper());
    };

    /**
     * Update rendered ball with underlying balls properties. 
     */
    RenderBall.prototype.update = function(t) {
        this.ball.advance(t);
        this.group.position.copy(this.ball.pos);
        var axis = this.ball.rvel.clone();
        axis.normalize();
        this.ballMesh.rotateOnAxis(axis,0.01);
        
    };
    
    return RenderBall;
});
