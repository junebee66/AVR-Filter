import * as THREE from 'https://cdn.skypack.dev/three@0.128.0/build/three.module.js';

import { AnaglyphEffect } from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/effects/AnaglyphEffect.js';
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/controls/OrbitControls.js';
import {OBJLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/loaders/OBJLoader.js';
import {MTLLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/loaders/MTLLoader.js';

// import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/loaders/GLTFLoader.js";
// import { GLTFLoader } from 'https://unpkg.com/three/examples/jsm/loaders/GLTFLoader.js';
// import { RGBELoader } from 'https://unpkg.com/three/examples/jsm/loaders/RGBELoader.js';

let container, camera, scene, renderer, effect, adTexture, adMaterial, adPlane, YTTexture, YTMaterial, YTPlane;

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

function init() {


    // const gltfLoader = new THREE.GLTFLoader();


                // render();


    container = document.createElement( 'div' );
    document.body.appendChild( container );


    camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.01, 100 );
    camera.position.z = 3;
    camera.focalLength = 3;

    const controls = new OrbitControls(camera, container);
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

    }


    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    container.appendChild( renderer.domElement );

    const width = window.innerWidth || 2;
    const height = window.innerHeight || 2;

    effect = new AnaglyphEffect( renderer );
    effect.setSize( width, height );

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

      //ad Box
      {
        adTexture = THREE.ImageUtils.loadTexture( "./source/ad.jpg" );

        // assuming you want the texture to repeat in both directions:
        adTexture.wrapS = THREE.RepeatWrapping; 
        adTexture.wrapT = THREE.RepeatWrapping;
        
        // how many times to repeat in each direction; the default is (1,1),
        // which is probably why your example wasn't working
        adTexture.repeat.set( 1, 1 ); 
        // console.log(adMaterial);
        
        adMaterial = new THREE.MeshLambertMaterial({ map : adTexture });
        adPlane = new THREE.Mesh(new THREE.PlaneGeometry(2.5, 1), adMaterial);
        adPlane.material.side = THREE.DoubleSide;
        adPlane.position.x = 0;

        scene.add(adPlane);
      }
      
      //YouTube background
      {
        YTTexture = THREE.ImageUtils.loadTexture( "./source/Youtube-Video-UI.jpg" );

        // assuming you want the texture to repeat in both directions:
        YTTexture.wrapS = THREE.RepeatWrapping; 
        YTTexture.wrapT = THREE.RepeatWrapping;
        
        // how many times to repeat in each direction; the default is (1,1),
        // which is probably why your example wasn't working
        YTTexture.repeat.set( 1, 1 ); 
        // console.log(YTMaterial);
        
        YTMaterial = new THREE.MeshLambertMaterial({ map : YTTexture });
        YTPlane = new THREE.Mesh(new THREE.PlaneGeometry(5, 3), YTMaterial);
        YTPlane.material.side = THREE.DoubleSide;
        YTPlane.position.x = 0;
        YTPlane.position.x = -2;
        YTPlane.position.z = -1;

        scene.add(YTPlane);
      }

      {
        const webcam = document.createElement('video')
            var constraints = { video: { width: 600, height: 400 } }
            navigator.mediaDevices
                .getUserMedia(constraints)
                .then(function (mediaStream) {
                    webcam.srcObject = mediaStream
                    webcam.onloadedmetadata = function (e) {
                        webcam.setAttribute('autoplay', 'true')
                        webcam.setAttribute('playsinline', 'true')
                        webcam.play()
                    }
                })
                .catch(function (err) {
                    alert(err.name + ': ' + err.message)
                })
            const webcamCanvas = document.createElement('canvas')
            webcamCanvas.width = 512
            webcamCanvas.height = 512
            const canvasCtx = webcamCanvas.getContext('2d')
            canvasCtx.fillStyle = '#000000'
            canvasCtx.fillRect(0, 0, webcamCanvas.width, webcamCanvas.height)
            const webcamTexture = new THREE.Texture(webcamCanvas)
            webcamTexture.minFilter = THREE.LinearFilter
            webcamTexture.magFilter = THREE.LinearFilter
            const geometry = new THREE.BoxGeometry()
            //const material: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({ map: webcamTexture})
            function vertexShader() {
                return `
                varying vec2 vUv;
                void main( void ) {     
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
                }
            `
            }
            function fragmentShader() {
                return `
                uniform vec3 keyColor;
                uniform float similarity;
                uniform float smoothness;
                varying vec2 vUv;
                uniform sampler2D map;
                void main() {

                    vec4 videoColor = texture2D(map, vUv);
            
                    float Y1 = 0.299 * keyColor.r + 0.587 * keyColor.g + 0.114 * keyColor.b;
                    float Cr1 = keyColor.r - Y1;
                    float Cb1 = keyColor.b - Y1;
                    
                    float Y2 = 0.299 * videoColor.r + 0.587 * videoColor.g + 0.114 * videoColor.b;
                    float Cr2 = videoColor.r - Y2; 
                    float Cb2 = videoColor.b - Y2; 
                    
                    float blend = smoothstep(similarity, similarity + smoothness, distance(vec2(Cr2, Cb2), vec2(Cr1, Cb1)));
                    gl_FragColor = vec4(videoColor.rgb, videoColor.a * blend); 
                }
            `
            }
            const camMaterial = new THREE.ShaderMaterial({
                transparent: true,
                uniforms: {
                    map: { value: webcamTexture },
                    keyColor: { value: [0.0, 1.0, 0.0] },
                    similarity: { value: 0.8 },
                    smoothness: { value: 0.0 },
                },
                vertexShader: vertexShader(),
                fragmentShader: fragmentShader(),
            })
            const camCube = new THREE.Mesh(geometry, camMaterial)
            camCube.add(new THREE.BoxHelper(camCube, 0xff0000))
            camCube.rotateY(0.5)
            camCube.scale.x = 4
            camCube.scale.y = 3
            camCube.scale.z = 4
            scene.add(camCube)
            // const stats = new Stats()
            // document.body.appendChild(stats.dom)
            // var data = {
            //     keyColor: [0, 255, 0],
            //     similarity: 0.8,
            //     smoothness: 0.0,
            // }
            // const gui = new GUI()
            // gui.addColor(data, 'keyColor').onChange(() => updateKeyColor(data.keyColor))
            // gui.add(data, 'similarity', 0.0, 1.0).onChange(() => updateSimilarity(data.similarity))
            // gui.add(data, 'smoothness', 0.0, 1.0).onChange(() => updateSmoothness(data.smoothness))
            // function updateKeyColor(v) {
            //     material.uniforms.keyColor.value = [v[0] / 255, v[1] / 255, v[2] / 255]
            // }
            // function updateSimilarity(v) {
            //     material.uniforms.similarity.value = v
            // }
            // function updateSmoothness(v) {
            //     material.uniforms.smoothness.value = v
            // }
            var animate = function () {
                requestAnimationFrame(animate)
                if (webcam.readyState === webcam.HAVE_ENOUGH_DATA) {
                    canvasCtx.drawImage(webcam, 0, 0, webcamCanvas.width, webcamCanvas.height)
                    webcamTexture.needsUpdate = true
                }
                controls.update()
                render()
                // stats.update()
            }
            function render() {
                renderer.render(scene, camera)
            }
            animate()
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

    window.addEventListener( 'resize', onWindowResize, false );

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


      effect.render( scene, camera );
}








