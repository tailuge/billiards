/**
 *
 * Arrow (used for inspecting vectors on screen)
 *
 */

define([
    'src/js/mythree'
], function(THREE) {

    'use strict';

    /**
     *  Constructor. Creates vectors.
     */
    function Arrow(dir, origin, color) {
        var normalisedDir = new THREE.Vector3();
        normalisedDir.copy(dir);
        normalisedDir.normalize();
        
        this.arrowHelper = new THREE.ArrowHelper(normalisedDir, origin, dir.length(), color, 1,0.5);
        //this.update(dir,origin);
    }

    Arrow.prototype.update = function(dir, origin) {
        var normalisedDir = new THREE.Vector3();
        normalisedDir.copy(dir);
        normalisedDir.normalize();
        this.arrowHelper.setDirection(dir);
        this.arrowHelper.setLength(dir.length());
    };

    /**
     * get arrow helper object (to add to scene)
     */
    Arrow.prototype.getArrowHelper = function() {
        return this.arrowHelper;
    };

    return Arrow;
});
