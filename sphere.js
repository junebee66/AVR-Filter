import * as THREE from 'https://cdn.skypack.dev/three@0.128.0/build/three.module.js';

import { AnaglyphEffect } from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/effects/AnaglyphEffect.js';
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/controls/OrbitControls.js';
import {OBJLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/loaders/OBJLoader.js';
import {MTLLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/loaders/MTLLoader.js';

// import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/loaders/GLTFLoader.js";
// import { GLTFLoader } from 'https://unpkg.com/three/examples/jsm/loaders/GLTFLoader.js';
// import { RGBELoader } from 'https://unpkg.com/three/examples/jsm/loaders/RGBELoader.js';

let container, camera, scene, renderer, effect, leftC;

// const loader;
const spheres = [];
const boxes = [];



let mouseX = 0;
let mouseY = 0;

let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

// document.addEventListener( 'mousemove', onDocumentMouseMove, false );

init();
animate();

    // container = document.querySelector('#leftColumn');
    // document.body.appendChild( container );

function init() {


    // const gltfLoader = new THREE.GLTFLoader();


                // render();
            

    // leftC = document.querySelector("#mainVideo");
    // const node = document.getElementById("myList2").lastElementChild;
    // document.getElementById("myList1").appendChild(node);

    container = document.createElement( 'div' );
    // document.leftC.appendChild( container ) ;
    leftC= document.querySelector('#mainVideo');
    leftC.appendChild( container );
    // const leftC = document.getElementById("mainVideo").appendChild( container );

    


    // container = document.querySelector('#leftColumn');
    // document.body.appendChild( container );
    // renderer = new THREE.WebGLRenderer({canvas});


    camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.01, 100 );
    camera.position.z = 3;
    camera.focalLength = 3;

    const controls = new OrbitControls(camera, leftC);
    controls.target.set(0, 5, 0);
    controls.update();
      

    const path = "https://threejs.org/examples/textures/cube/pisa/";
    const format = '.png';
    const urls = [
    	path + 'px' + format, path + 'nx' + format,
    	path + 'py' + format, path + 'ny' + format,
    	path + 'pz' + format, path + 'nz' + format
    ];

    // const path = "https://threejs.org/examples/textures/cube/SwedishRoyalCastle/";
    // const format = '.jpg';
    // const urls = [
    // 	path + 'px' + format, path + 'nx' + format,
    // 	path + 'py' + format, path + 'ny' + format,
    // 	path + 'pz' + format, path + 'nz' + format
    // ];


    // const path = "https://threejs.org/examples/textures/cube/Park3Med/";
    // const format = '.jpg';
    // const urls = [
    //     path + 'px' + format, path + 'nx' + format,
    //     path + 'py' + format, path + 'ny' + format,
    //     path + 'pz' + format, path + 'nz' + format
    // ];


    const textureCube = new THREE.CubeTextureLoader().load( urls );

    scene = new THREE.Scene();
    scene.background = textureCube;


    const geometry = new THREE.SphereBufferGeometry( 0.1, 32, 16 );
    const material = new THREE.MeshBasicMaterial( { color: 0xffffff, envMap: textureCube } );

    

    for ( let i = 0; i < 500; i ++ ) {

        const mesh = new THREE.Mesh( geometry, material );

        mesh.position.x = Math.random() * 10 - 5;
        mesh.position.y = Math.random() * 10 - 5;
        mesh.position.z = Math.random() * 10 - 5;

        mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 3 + 1;
        
        scene.add(mesh);
        spheres.push(mesh);

        const boxgeometry = new THREE.BoxGeometry(1,1,1);
        const boxcube = new THREE.Mesh(boxgeometry, material);
        boxcube.position.x = Math.random() * 10 - 5;
        boxcube.position.y = Math.random() * 10 - 5;
        boxcube.position.z = Math.random() * 10 - 5;

        boxcube.scale.x = boxcube.scale.y = boxcube.scale.z = Math.random()/5;

        // scene.add(boxcube); // remeber to put in the scene
        boxes.push(boxcube);

    }


    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    leftC.appendChild( renderer.domElement );

    const width = window.innerWidth || 2;
    const height = window.innerHeight || 2;

    // const width = leftC.innerWidth;
    // const height = leftC.innerHeight;

    // console.log(width);

    effect = new AnaglyphEffect( renderer );
    // effect.setSize( width, height );
    effect.setSize( width*0.68, height*0.7);

    const planeSize = 4000;

    const loader = new THREE.TextureLoader();
    const texture = loader.load('https://threejsfundamentals.org/threejs/resources/images/checker.png');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.magFilter = THREE.NearestFilter;
    const repeats = planeSize / 200;
    texture.repeat.set(repeats, repeats);

    const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
    const planeMat = new THREE.MeshPhongMaterial({
        map: texture,
        side: THREE.DoubleSide,
    });

    {
        const skyColor = 0xB1E1FF;  // light blue
        const groundColor = 0xB97A20;  // brownish orange
        const intensity = 1;
        const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
        scene.add(light);
      }
    
      {
        const color = 0xFFFFFF;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(5, 10, 2);
        scene.add(light);
        scene.add(light.target);
      }



    function frameArea(sizeToFitOnScreen, boxSize, boxCenter, camera) {
        const halfSizeToFitOnScreen = sizeToFitOnScreen * 0.5;
        const halfFovY = THREE.MathUtils.degToRad(camera.fov * .5);
        const distance = halfSizeToFitOnScreen / Math.tan(halfFovY);
        // compute a unit vector that points in the direction the camera is now
        // in the xz plane from the center of the box
        const direction = (new THREE.Vector3())
            .subVectors(camera.position, boxCenter)
            .multiply(new THREE.Vector3(1, 0, 1))
            .normalize();
    
        // move the camera to a position distance units way from the center
        // in whatever direction the camera was from the center already
        camera.position.copy(direction.multiplyScalar(distance).add(boxCenter));
    
        // pick some near and far values for the frustum that
        // will contain the box.
        camera.near = boxSize / 100;
        camera.far = boxSize * 100;
    
        camera.updateProjectionMatrix();
    
        // point the camera to look at the center of the box
        camera.lookAt(boxCenter.x, boxCenter.y, boxCenter.z);
      }

    const mtlLoader = new MTLLoader();
    mtlLoader.load('https://threejsfundamentals.org/threejs/resources/models/windmill_2/windmill-fixed.mtl', (mtl) => {
      mtl.preload();
      const objLoader = new OBJLoader();
      objLoader.setMaterials(mtl);
      objLoader.load('https://threejsfundamentals.org/threejs/resources/models/windmill_2/windmill.obj', (root) => {
        root.scale.x = root.scale.y = root.scale.z = 0.001;   
      scene.add(root);

        // compute the box that contains all the stuff
        // from root and below
        const box = new THREE.Box3().setFromObject(root);

        const boxSize = box.getSize(new THREE.Vector3()).length();
        const boxCenter = box.getCenter(new THREE.Vector3());

        // set the camera to frame the box
        frameArea(boxSize * 1.2, boxSize, boxCenter, camera);

        // update the Trackball controls to handle the new size
        controls.maxDistance = boxSize * 10;
        controls.target.copy(boxCenter);
        controls.update();
      });
    });





    //

    // window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {

    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    effect.setSize( window.innerWidth, window.innerHeight );

}

// function onDocumentMouseMove( event ) {

//     mouseX = ( event.clientX - windowHalfX ) / 100;
//     mouseY = ( event.clientY - windowHalfY ) / 100;

// }

//

function animate() {

    requestAnimationFrame( animate );

    render();

}

function render() {

    const timer = 0.0001 * Date.now();

    camera.position.x += ( mouseX - camera.position.x ) * .05;
    camera.position.y += ( - mouseY - camera.position.y ) * .05;

    camera.lookAt( scene.position );

    for ( let i = 0, il = spheres.length; i < il; i ++ ) {

        const sphere = spheres[ i ];

        sphere.position.x = 5 * Math.cos( timer + i );
        sphere.position.y = 5 * Math.sin( timer + i * 1.1 );
 
        sphere.position.x = 5 * Math.cos( timer + i );
        sphere.position.y = 5 * Math.sin( timer + i * 1.1 );

    }

    for ( let i = 0, il = boxes.length; i < il; i ++ ) {

        const box = boxes[ i ];

        box.position.x = 5 * Math.cos( timer + i );
        box.position.y = 5 * Math.sin( timer + i * 1.1 );

        box.position.x = 5 * Math.cos( timer + i );
        box.position.y = 5 * Math.sin( timer + i * 1.1 );

    }

    // function resizeRendererToDisplaySize(renderer) {
    //     const canvas = renderer.domElement;
    //     const width = canvas.clientWidth;
    //     const height = canvas.clientHeight;
    //     const needResize = canvas.width !== width || canvas.height !== height;
    //     if (needResize) {
    //       renderer.setSize(width, height, false);
    //     }
    //     return needResize;
    //   }
    


    // if (resizeRendererToDisplaySize(renderer)) {
    //     const canvas = renderer.domElement;
    //     camera.aspect = canvas.clientWidth / canvas.clientHeight;
    //     camera.updateProjectionMatrix();
    //   }


      effect.render( scene, camera );
}








