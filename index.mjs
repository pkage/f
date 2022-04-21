// import * as THREE from 'https://threejs.org/build/three.module.js';
// import { OrbitControls } from 'https://threejs.org/examples/jsm/controls/OrbitControls.js';
// import { AmmoPhysics } from 'https://threejs.org/examples/jsm/physics/AmmoPhysics.js';
// import Stats from 'https://threejs.org/examples/jsm/libs/stats.module.js';

import * as THREE from './mjs/three.module.js'
import { OrbitControls } from './mjs/OrbitControls.mjs'
import { AmmoPhysics } from './mjs/AmmoPhysics.mjs'
import Stats from './mjs/stats.module.js';

var camera, scene, renderer, stats;
var physics, position;

var boxes, boxes2;

init();

async function init() {

    physics = await AmmoPhysics();
    position = new THREE.Vector3();

    //

    camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 100 );
    camera.position.set( - 1, 1.5, 2 );
    camera.lookAt( 0, 0.5, 0 );

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x666666 );

    var light = new THREE.HemisphereLight();
    light.intensity = 0.35;
    scene.add( light );

    var light = new THREE.DirectionalLight();
    light.position.set( 5, 5, 5 );
    light.castShadow = true;
    light.shadow.camera.zoom = 2;
    scene.add( light );

    var floor = new THREE.Mesh(
        new THREE.BoxBufferGeometry( 10, 5, 10 ),
        new THREE.ShadowMaterial( { color: 0x111111 } )
    );
    floor.position.y = - 2.5;
    floor.receiveShadow = true;
    scene.add( floor );
    physics.addMesh( floor );

    //

    var texture_front = new THREE.TextureLoader().load( 'img/F front-01.png' );
    var texture_back = new THREE.TextureLoader().load( 'img/F back-01.png' );

    var material = new THREE.MeshLambertMaterial({ map: texture_front });
    var material2 = new THREE.MeshLambertMaterial({ map: texture_back });

    var matrix = new THREE.Matrix4();
    var color = new THREE.Color();

    // Boxes

    var geometry = new THREE.BoxBufferGeometry( 0.2, 0.01, 0.1 );
    boxes = new THREE.InstancedMesh( geometry, material, 50 );
    boxes.castShadow = true;
    boxes.receiveShadow = true;
    scene.add( boxes );

    for ( var i = 0; i < boxes.count; i ++ ) {

        matrix.setPosition( Math.random() - 0.5, Math.random() * 2, Math.random() - 0.5 );
        boxes.setMatrixAt( i, matrix );
        //boxes.setColorAt( i, color.setHex( 0xffffff * Math.random() ) );

    }

    physics.addMesh( boxes, 1 );

    // Boxes 2

    /*
    var geometry = new THREE.IcosahedronBufferGeometry( 0.075, 3 );
    */
    boxes2 = new THREE.InstancedMesh( geometry, material2, 50 );
    boxes2.castShadow = true;
    boxes2.receiveShadow = true;
    scene.add( boxes2 );

    for ( var i = 0; i < boxes2.count; i ++ ) {

        matrix.setPosition( Math.random() - 0.5, Math.random() * 2, Math.random() - 0.5 );
        boxes2.setMatrixAt( i, matrix );
        //boxes2.setColorAt( i, color.setHex( 0xffffff * Math.random() ) );

    }

    physics.addMesh( boxes2, 1 );

    //

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMap.enabled = true;
    renderer.outputEncoding = THREE.sRGBEncoding;
    document.body.appendChild( renderer.domElement );

    stats = new Stats();
    document.body.appendChild( stats.dom );

    //

    var controls = new OrbitControls( camera, renderer.domElement );
    controls.target.y = 0.5;
    controls.update();

    animate();

}

function animate() {

    requestAnimationFrame( animate );

    //

    var index = Math.floor( Math.random() * boxes.count );

    position.set( (Math.random()/2) - 0.25, Math.random() + 1, (Math.random()/2) - 0.25);
    physics.setMeshPosition( boxes, position, index );

    //
    var index = Math.floor( Math.random() * boxes2.count );

    position.set( (Math.random()/2) - 0.25, Math.random() + 1, (Math.random()/2) - 0.25);
    physics.setMeshPosition( boxes2, position, index );

    renderer.render( scene, camera );

    stats.update();

}
