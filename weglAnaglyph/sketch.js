import * as THREE from 'https://cdn.skypack.dev/three@0.128.0/build/three.module.js';

import { AnaglyphEffect } from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/effects/AnaglyphEffect.js';
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/controls/OrbitControls.js';
import {OBJLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/loaders/OBJLoader.js';
import {MTLLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/loaders/MTLLoader.js';
import {DragControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/controls/DragControls.js';

// import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/loaders/GLTFLoader.js";
// import { GLTFLoader } from 'https://unpkg.com/three/examples/jsm/loaders/GLTFLoader.js';
// import { RGBELoader } from 'https://unpkg.com/three/examples/jsm/loaders/RGBELoader.js';

let container, camera, scene, renderer, effect, adTexture, adMaterial, adPlane, YTTexture, YTMaterial, YTPlane, INTERSECTED;

// const loader;
const spheres = [];
const boxes = [];

let mouseX = 0;
let mouseY = 0;

let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

let dragControls, group;
let enableSelection = true;

const objects = [];

let draggableObjects;
let myGridInteractionObjects =[];
let myGridObjects= [];

const mouse = new THREE.Vector2(), raycaster = new THREE.Raycaster();

// document.addEventListener( 'mousemove', onDocumentMouseMove, false );

init();
animate();

function init() {


    // const gltfLoader = new THREE.GLTFLoader();


                // render();


    container = document.createElement( 'div' );
    document.body.appendChild( container );


    camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.01, 100 );
    camera.position.z = 3;
    camera.focalLength = 3;


    const orControls = new OrbitControls(camera, container);
    orControls.target.set(0, 5, 0);
    orControls.update();
      

    // const path = "https://threejs.org/examples/textures/cube/pisa/";
    // const format = '.png';
    // const urls = [
    // 	path + 'px' + format, path + 'nx' + format,
    // 	path + 'py' + format, path + 'ny' + format,
    // 	path + 'pz' + format, path + 'nz' + format
    // ];


    //MilkyWay
    // const path = "https://threejs.org/examples/textures/cube/MilkyWay/";
    // const format = '.jpg';
    // const urls = [
    // 	path + 'dark-s_px' + format, path + 'dark-s_nx' + format,
    // 	path + 'dark-s_py' + format, path + 'dark-s_ny' + format,
    // 	path + 'dark-s_pz' + format, path + 'dark-s_nz' + format
    // ];

    //Park
    const path = "https://threejs.org/examples/textures/cube/Park2/";
    const format = '.jpg';
    const urls = [
    	path + 'posx' + format, path + 'negx' + format,
    	path + 'posy' + format, path + 'negy' + format,
    	path + 'posz' + format, path + 'negz' + format
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


    //Create Scene
    const textureCube = new THREE.CubeTextureLoader().load( urls );

    scene = new THREE.Scene();
    scene.background = textureCube;

    group = new THREE.Group();
    scene.add( group );

    
    
    
    const geometry = new THREE.SphereBufferGeometry( 0.1, 32, 16 );
    const material = new THREE.MeshBasicMaterial( { color: 0xffffff, envMap: textureCube } );

    

    for ( let i = 0; i < 500; i ++ ) {

        const mesh = new THREE.Mesh( geometry, material );

        mesh.position.x = Math.random() * 10 - 5;
        mesh.position.y = Math.random() * 10 - 5;
        mesh.position.z = Math.random() * 10 - 5;

        mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 3 + 1;
        
        // scene.add(mesh);
        spheres.push(mesh);

        const boxgeometry = new THREE.BoxGeometry(1,1,1);
        const boxcube = new THREE.Mesh(boxgeometry, material);
        boxcube.position.x = Math.random() * 10 - 5;
        boxcube.position.y = Math.random() * 10 - 5;
        boxcube.position.z = Math.random() * 10 - 5;


        boxcube.scale.x = boxcube.scale.y = boxcube.scale.z = Math.random()/5;

        scene.add(boxcube); // remeber to put in the scene
        boxes.push(boxcube);
        objects.push( boxcube );

    }


    
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;

    container.appendChild( renderer.domElement );

    const width = window.innerWidth || 2;
    const height = window.innerHeight || 2;

    effect = new AnaglyphEffect( renderer );
    effect.setSize( width, height );


    dragControls = new DragControls( [ ... objects ], camera, renderer.domElement );
    dragControls.addEventListener( 'drag', render );

		
    window.addEventListener( 'resize', onWindowResize );

    document.addEventListener( 'click', onClick );
    window.addEventListener( 'keydown', onKeyDown );
    window.addEventListener( 'keyup', onKeyUp );
    // window.addEventListener( 'mousemove', mousemove );

    render();
  


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
  

    
        const skyColor = 0xB1E1FF;  // light blue
        const groundColor = 0xB97A20;  // brownish orange
        const hemiIntensity = 1;
        const hemiLight = new THREE.HemisphereLight(skyColor, groundColor, hemiIntensity);
        scene.add(hemiLight);
      
    
      
        const color = 0xFFFFFF;
        const dirIntensity = 1;
        const dirLight = new THREE.DirectionalLight(color, dirIntensity);
        dirLight.position.set(5, 10, 2);
        scene.add(dirLight);
        scene.add(dirLight.target);
      

      //ad Box
      
        adTexture = THREE.ImageUtils.loadTexture( "./source/ad.jpg" );

        // assuming you want the texture to repeat in both directions:
        adTexture.wrapS = THREE.RepeatWrapping; 
        adTexture.wrapT = THREE.RepeatWrapping;
        
        // how many times to repeat in each direction; the default is (1,1),
        // which is probably why your example wasn't working
        adTexture.repeat.set( 1, 1 ); 
        
        adMaterial = new THREE.MeshLambertMaterial({ map : adTexture });
        adPlane = new THREE.Mesh(new THREE.PlaneGeometry(2.5/1.9, 1/1.9), adMaterial);
        adPlane.material.side = THREE.DoubleSide;
        // adPlane.position.x = 1.5;
        // adPlane.position.y = 0.5;
        adPlane.position.x = 1.5;
        adPlane.position.y = 0.5;
        adPlane.position.z = 0;

        scene.add(adPlane);
        objects.push( adPlane );


        let mat = new THREE.MeshBasicMaterial({ color: "red" });
        let interactionGeo = new THREE.PlaneGeometry(2.5/1.9, 1/1.9);
        // let interactionGeo = new THREE.Mesh(new THREE.PlaneGeometry(5, 3), YTMaterial);
        let interactionMesh = new THREE.Mesh(interactionGeo, mat);
        // interactionMesh.position.set(1.5, 0.5, -0.01);
        interactionMesh.position.set(1.5, 0.5, -0.01);

        // interactionMesh.layers.set(2);

        interactionMesh.userData.mesh = adPlane;

        myGridInteractionObjects.push(interactionMesh);
        // scene.add(interactionMesh);
      
      
      //YouTube background
      
        YTTexture = THREE.ImageUtils.loadTexture( "./source/Youtube-Video-UI.jpg" );

        // assuming you want the texture to repeat in both directions:
        YTTexture.wrapS = THREE.RepeatWrapping; 
        YTTexture.wrapT = THREE.RepeatWrapping;
        
        // how many times to repeat in each direction; the default is (1,1),
        // which is probably why your example wasn't working
        YTTexture.repeat.set( 1, 1 ); 
        
        YTMaterial = new THREE.MeshLambertMaterial({ map : YTTexture });
        YTPlane = new THREE.Mesh(new THREE.PlaneGeometry(5, 3), YTMaterial);
        YTPlane.material.side = THREE.DoubleSide;
        YTPlane.position.x = 0;
        YTPlane.position.x = 0;
        // YTPlane.position.z = -0.4;
        YTPlane.position.z = -0.4;

        scene.add(YTPlane);
        // objects.push( YTPlane );

      

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


      // const pngloader = new THREE.ImageLoader();

      // // load a image resource
      // pngloader.load(
      // // resource URL
      // './source/forest/textures/nadelbaum_diff.png', (png) => {
        

    const mtlLoader = new MTLLoader();
    // mtlLoader.load('https://threejsfundamentals.org/threejs/resources/models/windmill_2/windmill-fixed.mtl', (mtl) => {
      mtlLoader.load('./source/forest-plain/source/Forest/Forest.mtl', (mtl) => {
      mtl.preload();
      const objLoader = new OBJLoader();
      objLoader.setMaterials(png);
      // objLoader.load('https://threejsfundamentals.org/threejs/resources/models/windmill_2/windmill.obj', (root) => {
      objLoader.load('./source/forest-plain/source/Forest/Forest.obj', (root) => {
      // root.scale.x = root.scale.y = root.scale.z = 0.001;
      root.scale.x = root.scale.y = root.scale.z = 0.05;   
      
        console.log('object')
        objects.push( root );
        scene.add(root);
        

        // compute the box that contains all the stuff
        // from root and below
        const box = new THREE.Box3().setFromObject(root);

        const boxSize = box.getSize(new THREE.Vector3()).length();
        const boxCenter = box.getCenter(new THREE.Vector3());

        // set the camera to frame the box
        frameArea(boxSize * 1.2, boxSize, boxCenter, camera);

        // update the Trackball controls to handle the new size
        // orControls.maxDistance = boxSize * 10;
        // orControls.target.copy(boxCenter);
        // controls.update();
      });
    });
    // });


}

// function interactionMesh(mesh){

//   let interactionGeo = new THREE.BoxGeometry(1, 0.1, 1);
//   let mat = new THREE.MeshBasicMaterial({ color: "red" });

//   // for (let i = 0; i < objects.length; i++) {
//     // let mesh = new THREE.Mesh(objects[i], mat);
//     // mesh.position.set(objects[i].position.x, objects[i].position.y, objects[i].position.z);
//     myGridObjects.push(mesh);
//     // scene.add(mesh);


//       // create a second mesh which will only be used for raycasting
//       // and won't be visible
//       let interactionMesh = new THREE.Mesh(interactionGeo, mat);
//       console.log(mesh);
//       interactionMesh.position.set(0, 0,0);
//       // interactionMesh.mesh.scale.set(objects[i].position.x, objects[i].position.y, objects[i].position.z);
//       // add this mesh to a layer which is visible to the raycaster but not the camera
//       interactionMesh.layers.set(2);

//       // console.log(interactionMesh);
//       // store a reference to the visible mesh in the interaction meshes' userData
//       interactionMesh.userData.mesh = mesh;

//       myGridInteractionObjects.push(interactionMesh);
//       scene.add(interactionMesh);
//   // }
// }
  

function onKeyDown( event ) {

  enableSelection = ( event.keyCode === 16 ) ? true : false;

}

function onKeyUp() {

  enableSelection = false;

}

// function mousemove(event){
  document.addEventListener(
    "mousemove",
    (ev) => {

  // draggableObjects = dragControls.getObjects();
  // draggableObjects.length = 0;

  mouse.x = ( ev.clientX / window.innerWidth ) * 2 - 1;
  mouse.y = - ( ev.clientY / window.innerHeight ) * 2 + 1;

  raycaster.setFromCamera( mouse, camera );

  // const intersections = raycaster.intersectObjects( myGridInteractionObjects, true );
  
  // const intersections = raycaster.intersectObjects( objects, true );
  const intersections = raycaster.intersectObjects( myGridInteractionObjects , true);


  // console.log(intersections);
  for(let o=0; o<objects.length; o++){
    objects[o].position.z = 0;
  }
    
  for(let i=0; i<intersections.length; i++){
      // intersections[i].position.z = -3;
      console.log('hover');
      intersections[i].object.userData.mesh.position.z = 3; 
    }
  render();

  // }
  // console.log('objects');
  // console.log('hover');
// }
},
false
);



function onClick( event ) {

  event.preventDefault();
  // console.log('drag');

  if ( enableSelection === true ) {

    // console.log('drag')

    draggableObjects = dragControls.getObjects();
    draggableObjects.length = 0;

    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    raycaster.setFromCamera( mouse, camera );

    const intersections = raycaster.intersectObjects( objects, true );

    if ( intersections.length > 0 ) {

      // const eachObject = intersections[ 0 ].eachObject;

      // if ( group.children.includes( eachObject ) === true ) {

      //   eachObject.material.emissive.set( 0x000000 );
      //   scene.attach( eachObject );

      // } else {

      //   eachObject.material.emissive.set( 0xaaaaaa );
      //   group.attach( eachObject );

      // }

      // console.log(intersections);

      // intersections[0].object.userData.mesh.position.z = -3; 



      
      

      dragControls.transformGroup = true;
      draggableObjects.push( group );

      

      // console.log(group);

    }

    if ( group.children.length === 0 ) {

      dragControls.transformGroup = false;
      draggableObjects.push( ...objects );

      

    }

  }

  // console.log(draggableObjects);

  render();

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

    function resizeRendererToDisplaySize(renderer) {
        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
          renderer.setSize(width, height, false);
        }
        return needResize;
      }
    


    if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      }

      // renderer.render( scene, camera );
      effect.render( scene, camera );
}






