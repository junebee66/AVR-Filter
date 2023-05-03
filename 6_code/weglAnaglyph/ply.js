import * as THREE from 'https://cdn.skypack.dev/three@0.128.0/build/three.module.js';

import { AnaglyphEffect } from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/effects/AnaglyphEffect.js';
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/controls/OrbitControls.js';
import {OBJLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/loaders/OBJLoader.js';
import {PLYLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/loaders/PLYLoader.js';
import {PCDLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/loaders/PCDLoader.js';
import {MTLLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/loaders/MTLLoader.js';
import {DragControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/controls/DragControls.js';


let effect;


// const path = "https://threejs.org/examples/textures/cube/Park2/";
// const format = '.jpg';
// const urls = [
//     path + 'negx' + format, path + 'negy' + format,
//     path + 'negz' + format, path + 'posx' + format,
//     path + 'posy' + format, path + 'posz' + format
// ];

//MilkyWay
// const path = "https://threejs.org/examples/textures/cube/MilkyWay/";
// const format = '.jpg';
// const urls = [
//     path + 'dark-s_px' + format, path + 'dark-s_nx' + format,
//     path + 'dark-s_py' + format, path + 'dark-s_ny' + format,
//     path + 'dark-s_pz' + format, path + 'dark-s_nz' + format
// ];



const path = "https://threejs.org/examples/textures/cube/skyboxsun25deg/";
const format = '.jpg';
const urls = [
    path + 'px' + format, path + 'nx' + format,
    path + 'py' + format, path + 'ny' + format,
    path + 'pz' + format, path + 'nz' + format
];

const textureCube = new THREE.CubeTextureLoader().load( urls );

const scene = new THREE.Scene();
scene.background = textureCube;

// const scene = new THREE.Scene()
// scene.add(new THREE.AxesHelper(5))

const light = new THREE.SpotLight()
light.position.set(20, 20, 20)
scene.add(light)

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
)
camera.position.z = 40

const renderer = new THREE.WebGLRenderer()
renderer.outputEncoding = THREE.sRGBEncoding
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

effect = new AnaglyphEffect( renderer );
effect.setSize( window.innerWidth, window.innerHeight );

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.target.set(0, 5, 0);
// controls.maxDistance = 50;

// const envTexture = new THREE.CubeTextureLoader().load([
//     'img/px_50.png',
//     'img/nx_50.png',
//     'img/py_50.png',
//     'img/ny_50.png',
//     'img/pz_50.png',
//     'img/nz_50.png'
// ])
// envTexture.mapping = THREE.CubeReflectionMapping

const material = new THREE.MeshPhysicalMaterial({
    color: 0xb2ffc8,
    // envMap: envTexture,
    metalness: 0,
    roughness: 0,
    transparent: true,
    transmission: 1.0,
    side: THREE.DoubleSide,
    clearcoat: 1.0,
    clearcoatRoughness: 0.25
})

// const loader = new PLYLoader()
// loader.load(
//     './source/room/source/room.ply',
//     function (geometry) {
//         geometry.computeVertexNormals()
//         const mesh = new THREE.Mesh(geometry, material)
//         mesh.rotateX(-Math.PI / 2)
//         scene.add(mesh)
//     },
//     (xhr) => {
//         console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
//     },
//     (error) => {
//         console.log(error)
//     }
// )

const loader = new PCDLoader();

// load a resource
loader.load(
	// resource URL
	'./source/room/source/room.pcd',
    // './source/land/land.pcd',
	// called when the resource is loaded
	function ( points ) {
        points.material.size = 0.1;
        points.position.z = 40;
        points.position.y = 3;
        points.geometry.rotateZ(0);
        points.geometry.rotateX( Math.PI*1.5);
        points.geometry.rotateY( Math.PI/2);
        console.log(points);

		scene.add( points );

	},
	// called when loading is in progresses
	function ( xhr ) {

		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

	},
	// called when loading has errors
	function ( error ) {

		console.log( 'An error happened' );

	}
    );

window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}

// const stats = new Stats()
// document.body.appendChild(stats.dom)

function animate() {
    requestAnimationFrame(animate)

    controls.update()

    render()

    // stats.update()
}

function render() {
    // renderer.render(scene, camera);
    effect.render( scene, camera );
}

animate()