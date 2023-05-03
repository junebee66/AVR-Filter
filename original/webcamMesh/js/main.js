/**
 *
 * WebCam Mesh by Felix Turner
 * @felixturner / www.airtight.cc
 * (c) Airtight Interactive Inc. 2019
 *
 * Connects HTML5 WebCam input to a WebGL 3D Mesh. It creates a 3D depth map by mapping pixel brightness to Z-depth.
 * Perlin noise is used for the ripple effect and CSS3 filters are used for color effects.
 * Use mouse move to tilt and scroll wheel to zoom. Requires Chrome or Opera.
 *
 */
var fov = 70;
var canvasWidth = 320 / 2;
var canvasHeight = 240 / 2;
var vidWidth = 320;
var vidHeight = 240;
var tiltSpeed = 0.1;
var tiltAmount = 0.5;

var perlin = new ImprovedNoise();
var camera, scene, renderer;
var mouseX = 0;
var mouseY = 0;
var windowHalfX, windowHalfY;
var videoIn, videoInTexture;
var mainGroup;
var geometry;
var vidCanvas;
var ctx;
var pixels;
var noisePosn = 0;
var wireMaterial;
var meshMaterial;
var container;
var params;
var title, info, prompt;

function init() {
	//init HTML elements
	container = document.querySelector('#container');
	prompt = document.querySelector('#prompt');
	info = document.querySelector('#info');
	title = document.querySelector('#title');
	info.style.display = 'none';
	title.style.display = 'none';
	container.style.display = 'none';

	if (!hasWebGL()) {
		prompt.innerHTML = 'No WebGL support detected. Please try using latest Chrome or restarting the browser.';
		return;
	}

	if (!hasGetUserMedia()) {
		prompt.innerHTML = 'WebCam access is not supported in this browser. Please try using latest Chrome.';
		return;
	}

	prompt.innerHTML = 'Please allow camera access.';

	//get webcam
	navigator.getUserMedia =
		navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
	navigator.getUserMedia(
		{
			video: true,
		},
		onCamReady,
		function(error) {
			prompt.innerHTML = 'Unable to capture WebCam. Please reload the page or try using latest Chrome.';
			return;
		}
	);
}

function onCamReady(stream) {
	//init webcam texture
	videoIn = document.createElement('video');
	videoIn.width = vidWidth;
	videoIn.height = vidHeight;
	videoIn.autoplay = true;
	videoIn.loop = true;
	videoIn.onloadedmetadata = onCamMetaDataLoaded;
	videoIn.srcObject = stream;
}

function onCamMetaDataLoaded() {
	// stop the user getting a text cursor
	document.onselectstart = function() {
		return false;
	};

	//init control panel
	params = new WCMParams();
	gui = new dat.GUI();
	gui
		.add(params, 'zoom', 0.1, 5)
		.name('Zoom')
		.onChange(onParamsChange);
	gui.add(params, 'zDepth', 0, 1000).name('Z Depth');
	gui
		.add(params, 'mOpac', 0, 1)
		.name('Mesh Opacity')
		.onChange(onParamsChange);
	gui
		.add(params, 'wfOpac', 0, 0.3)
		.name('Grid Opacity')
		.onChange(onParamsChange);
	gui
		.add(params, 'contrast', 1, 5)
		.name('Contrast')
		.onChange(onParamsChange);
	gui
		.add(params, 'saturation', 0, 2)
		.name('Saturation')
		.onChange(onParamsChange);
	gui.add(params, 'noiseStrength', 0, 600).name('Noise Strength');
	gui.add(params, 'noiseSpeed', 0, 0.05).name('Noise Speed');
	gui.add(params, 'noiseScale', 0, 0.1).name('Noise Scale');
	gui.add(params, 'invertZ').name('Invert Z');
	//gui.add(this, 'saveImage').name('Snapshot');
	gui.close();
	gui.domElement.style.display = 'none';

	//Init 3D
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 1, 5000);
	camera.target = new THREE.Vector3(0, 0, 0);
	scene.add(camera);
	camera.position.z = 600;

	//toggle UI
	prompt.style.display = 'none';
	title.style.display = 'inline';
	container.style.display = 'inline';
	gui.domElement.style.display = 'inline';

	videoInTexture = new THREE.VideoTexture(videoIn);

	mainGroup = new THREE.Object3D();
	scene.add(mainGroup);

	//add video plane
	geometry = new THREE.PlaneGeometry(640, 480, canvasWidth, canvasHeight);
	geometry.dynamic = true;
	meshMaterial = new THREE.MeshBasicMaterial({
		opacity: 1,
		map: videoInTexture,
	});
	var mirror = new THREE.Mesh(geometry, meshMaterial);
	mainGroup.add(mirror);

	//add wireframe plane
	wireMaterial = new THREE.MeshBasicMaterial({
		opacity: 0.1,
		color: 0xffffff,
		wireframe: true,
		blending: THREE.AdditiveBlending,
		transparent: true,
	});
	var wiremirror = new THREE.Mesh(geometry, wireMaterial);
	mainGroup.add(wiremirror);
	wiremirror.position.z = 5;

	//init renderer
	renderer = new THREE.WebGLRenderer({
		antialias: true,
	});
	renderer.sortObjects = false;
	renderer.setSize(window.innerWidth, window.innerHeight);
	container.appendChild(renderer.domElement);

	// add Stats
	stats = new Stats();
	document.querySelector('.fps').appendChild(stats.domElement);

	//init vidCanvas - used to analyze the videoIn pixels
	vidCanvas = document.createElement('canvas');
	document.body.appendChild(vidCanvas);
	vidCanvas.style.position = 'absolute';
	vidCanvas.style.display = 'none';
	ctx = vidCanvas.getContext('2d');

	//init listeners
	document.addEventListener('mousemove', onMouseMove, false);
	window.addEventListener('resize', onResize, false);
	document.addEventListener('mousewheel', onWheel, false);
	container.addEventListener('click', hideInfo, false);
	document.querySelector('.closeBtn').addEventListener('click', hideInfo, false);
	title.addEventListener('click', showInfo, false);

	//handle WebGL context lost
	renderer.domElement.addEventListener(
		'webglcontextlost',
		function(event) {
			prompt.style.display = 'inline';
			prompt.innerHTML = 'WebGL Context Lost. Please try reloading the page.';
		},
		false
	);

	onResize();

	animate();
}

// params for dat.gui

function WCMParams() {
	this.zoom = 1;
	this.mOpac = 1;
	this.wfOpac = 0.1;
	this.contrast = 3;
	this.saturation = 1;
	this.invertZ = false;
	this.zDepth = 400;
	this.noiseStrength = 200;
	this.noiseScale = 0.01;
	this.noiseSpeed = 0.02;
	//this.doSnapshot = function() {};
}

function onParamsChange() {
	meshMaterial.opacity = params.mOpac;
	wireMaterial.opacity = params.wfOpac;
	container.style.webkitFilter = 'contrast(' + params.contrast + ') saturate(' + params.saturation + ')';
}

function getZDepths() {
	noisePosn += params.noiseSpeed;

	//draw webcam videoIn pixels to canvas for pixel analysis
	//double up on last pixel get because there is one more vert than pixels
	ctx.drawImage(videoIn, 0, 0, canvasWidth + 1, canvasHeight + 1);
	pixels = ctx.getImageData(0, 0, canvasWidth + 1, canvasHeight + 1).data;

	for (var i = 0; i < canvasWidth + 1; i++) {
		for (var j = 0; j < canvasHeight + 1; j++) {
			var color = new THREE.Color(getColor(i, j));
			var brightness = getBrightness(color);
			var gotoZ = params.zDepth * brightness - params.zDepth / 2;

			//add noise wobble
			gotoZ += perlin.noise(i * params.noiseScale, j * params.noiseScale, noisePosn) * params.noiseStrength;
			//invert?
			if (params.invertZ) gotoZ = -gotoZ;
			//tween to stablize
			geometry.vertices[j * (canvasWidth + 1) + i].z += (gotoZ - geometry.vertices[j * (canvasWidth + 1) + i].z) / 5;
		}
	}
	geometry.verticesNeedUpdate = true;
}

function onMouseMove(event) {
	mouseX = (event.clientX - windowHalfX) / windowHalfX;
	mouseY = (event.clientY - windowHalfY) / windowHalfY;
}

function animate() {
	getZDepths();
	stats.update();
	requestAnimationFrame(animate);
	render();
}

function render() {
	mainGroup.scale.setScalar(params.zoom);
	mainGroup.rotation.x += (mouseY * tiltAmount - mainGroup.rotation.x) * tiltSpeed;
	mainGroup.rotation.y += (mouseX * tiltAmount - mainGroup.rotation.y) * tiltSpeed;
	//camera.lookAt(camera.target);
	renderer.render(scene, camera);
}

function onResize() {
	renderer.setSize(window.innerWidth, window.innerHeight);
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;
}

// Returns a hexidecimal color for a given pixel in the pixel array.

function getColor(x, y) {
	var base = (Math.floor(y) * (canvasWidth + 1) + Math.floor(x)) * 4;
	var c = {
		r: pixels[base + 0],
		g: pixels[base + 1],
		b: pixels[base + 2],
		a: pixels[base + 3],
	};
	return (c.r << 16) + (c.g << 8) + c.b;
}

//return pixel brightness between 0 and 1 based on human perceptual bias

function getBrightness(c) {
	return 0.34 * c.r + 0.5 * c.g + 0.16 * c.b;
}

function hideInfo() {
	info.style.display = 'none';
	title.style.display = 'inline';
}

function showInfo() {
	info.style.display = 'inline';
	title.style.display = 'none';
}

function onWheel(event) {
	params.zoom += event.wheelDelta * 0.002;
	//limit
	params.zoom = Math.max(params.zoom, 0.1);
	params.zoom = Math.min(params.zoom, 5);

	//update gui slider
	gui.__controllers[0].updateDisplay();
}

function saveImage() {
	render();
	window.open(renderer.domElement.toDataURL('image/png'));
}

function hasWebGL() {
	try {
		return !!window.WebGLRenderingContext && !!document.createElement('canvas').getContext('experimental-webgl');
	} catch (e) {
		return false;
	}
}

function hasGetUserMedia() {
	return !!(
		navigator.getUserMedia ||
		navigator.webkitGetUserMedia ||
		navigator.mozGetUserMedia ||
		navigator.msGetUserMedia
	);
}

init();
