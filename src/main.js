/* globals window, document, requestAnimationFrame, animate */
require({
    baseUrl: '../',
}, [
    'src/js/mythree',
    'src/js/ball',
    'src/js/table',
    'src/js/cushion',
    'src/js/renderBall',
    'src/js/requestAnimationFrame'
], function(THREE, Ball, Table, Cushion, RenderBall, requestAnimationFrame) {

    'use strict';

    var camera, scene, renderer, controls, stats;
    var geometry, material, mesh;
    var tablegeom, tablemat;
    var renderBall1, renderBall2, renderBall3;
    var cushion, table;

    function init() {

        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
        camera.position.z = 30;
        camera.position.y = -2;
        camera.position.x = 0;
        camera.lookAt(new THREE.Vector3(0, 0, 0));

        scene = new THREE.Scene();

        table = new Table();
        cushion = new Cushion();

        tablegeom = new THREE.BoxGeometry(table.getWidth(), table.getLength(), 0.01);
        tablemat = new THREE.MeshLambertMaterial({
            color: 0x444499
        });

        mesh = new THREE.Mesh(tablegeom, tablemat);
        mesh.position.z = -1.0;
        mesh.receiveShadow = true;
        scene.add(mesh);

        var ball1 = new Ball();
        ball1.pos.set(5.5,-2,0);
        ball1.vel.set(0,0, 0);
        ball1.rvel.set(0,0,0);
        renderBall1 = new RenderBall(ball1, 0xffffff);

        var ball2 = new Ball();
        ball2.pos.set(3,-8,0);
        ball2.vel.set(0,2, 0);
        renderBall2 = new RenderBall(ball2, 0xff0000);

        var ball3 = new Ball();
        ball3.pos.set(6,-8,0);
        ball3.vel.set(0,2,0);
        ball3.rvel.set(4,0,0);

        renderBall3 = new RenderBall(ball3, 0xffff00);

        scene.add(renderBall1.getMesh());
        scene.add(renderBall2.getMesh());
        scene.add(renderBall3.getMesh());

        addSpotlight(scene);

        initialiseRenderer();
    }

    function initialiseRenderer() {
        var webGLRenderer = new THREE.WebGLRenderer();
        webGLRenderer.setClearColor(new THREE.Color(0xEEEEEE, 1.0));
        webGLRenderer.setSize(window.innerWidth, window.innerHeight);
        webGLRenderer.shadowMapEnabled = true;
        //webGLRenderer.shadowMapType = THREE.BasicShadowMap;
        renderer = webGLRenderer;
        document.body.appendChild(renderer.domElement);
    }

    function animate() {
        requestAnimationFrame(animate);
        var t = 0.1;
        renderBall1.update(t);
        renderBall2.update(t);
        renderBall3.update(t);

        var balls = [renderBall1.ball, renderBall2.ball, renderBall3.ball];
        balls.forEach(table.bounceCushions);
        
        balls.forEach( function (a) {
            balls.forEach( function (b) {
                if (a === b) {
                    return;
                }
                table.collideBalls(a,b);
            });
        });
        
        document.getElementById("debugDiv").innerHTML = "<pre>"+JSON.stringify(renderBall1.ball,null,2)+"</pre>";
        
        if (balls.every(function (a) {return a.checkStopped();})) {
            // all stopped
        }
        
        renderer.render(scene, camera);
    }

    function addSpotlight(scene) {

        // add subtle ambient lighting
        var ambientLight = new THREE.AmbientLight(0x222266);
        scene.add(ambientLight);

        // add spotlights for the shadows
        var spotLight = new THREE.SpotLight(0xffffff);
        spotLight.position.set(1, 15, 50);
        spotLight.castShadow = true;
        spotLight.shadowDarkness = 0.6;
        scene.add(spotLight);

        spotLight = new THREE.SpotLight(0xffffff);
        spotLight.position.set(1, -15, 50);
        spotLight.castShadow = true;
        spotLight.shadowDarkness = 0.6;
        scene.add(spotLight);
    }


    init();
    animate();

});
