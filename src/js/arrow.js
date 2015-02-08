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
     *  Constructor. Creates arrow with given properties.
     */
    function Arrow(color) {
        this.arrowHelper = new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, 0), 1, color, 1, 0.5);
    }

    Arrow.prototype.update = function(dir) {
        if (dir.length() === 0) {
            return;
        }

        var normalisedDir = new THREE.Vector3();
        normalisedDir.copy(dir);
        normalisedDir.normalize();
        this.arrowHelper.setDirection(dir);
        this.arrowHelper.setLength(4 /*dir.length()*/ );
    };

    /**
     * get arrow helper object (to add to scene)
     */
    Arrow.prototype.getArrowHelper = function() {
        return this.arrowHelper;
    };

    return Arrow;
});
