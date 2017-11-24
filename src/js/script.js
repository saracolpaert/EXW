import * as THREE from 'three';

const Colors = {
  white: new THREE.Color(`rgb(232, 234, 215)`),
  brownDark: new THREE.Color(`rgb(62, 77, 89)`),
  blue: new THREE.Color(`rgb(124, 152, 174)`),
  blueDark: new THREE.Color(`rgb(56, 93, 122)`)

};

// VARIABLEN
let renderer, scene, camera, HEIGHT, WIDTH, aspectRatio, fieldOfView, nearPlane, farPlane, container;
let hemisphereLight, shadowLight;
let airplane;
let geomRightWing;

const createScene = () => {

  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;

  scene = new THREE.Scene();

  aspectRatio = WIDTH / HEIGHT;
  fieldOfView = 60;
  nearPlane = 1;
  farPlane = 1000;

  camera = new THREE.PerspectiveCamera(
    fieldOfView,
    aspectRatio,
    nearPlane,
    farPlane
  );

  camera.position.x = 0;
  camera.position.z = 200;
  camera.position.y = 100;

  renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
  });

  renderer.setSize(WIDTH, HEIGHT);
  renderer.shadowMap.enabled = true;

  container = document.getElementById(`world`);
  container.appendChild(renderer.domElement);

  window.addEventListener(`resize`, handleWindowResize, false);
};

const handleWindowResize = () => {
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;

  renderer.setSize(WIDTH, HEIGHT);
  camera.aspect = WIDTH / HEIGHT;
  camera.updateProjectionMatrix();
};

const createLights = () => {
  hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, .9);

  shadowLight = new THREE.DirectionalLight(0xffffff, .9);

  shadowLight.position.set(150, 350, 350);
  shadowLight.castShadow = true;

  shadowLight.shadow.camera.left = - 400;
  shadowLight.shadow.camera.right = 400;
  shadowLight.shadow.camera.top = 400;
  shadowLight.shadow.camera.bottom = - 400;
  shadowLight.shadow.camera.near = 1;
  shadowLight.shadow.camera.far = 1000;

  shadowLight.shadow.mapSize.width = 2048;
  shadowLight.shadow.mapSize.height = 2048;

  scene.add(hemisphereLight);
  scene.add(shadowLight);
};

class AirPlane {
  constructor() {
    this.mesh = new THREE.Object3D();
    // this.mesh.rotation.x += 1;

    // Create the body
    const geomBody = new THREE.BoxGeometry(200, 170, 270, 1, 1, 1);

    const matBody = new THREE.MeshPhongMaterial({color: Colors.blue, shading: THREE.FlatShading});
    const body = new THREE.Mesh(geomBody, matBody);
    body.castShadow = true;
    body.receiveShadow = true;
    this.mesh.add(body);

    // Create the left Eye
    const geomLeftEye = new THREE.BoxGeometry(75, 150, 40, 1, 1, 1);
    const matLeftEye = new THREE.MeshPhongMaterial({color: Colors.blueDark});
    const leftEye = new THREE.Mesh(geomLeftEye, matLeftEye);
    leftEye.position.set(45, 0, 150);
    leftEye.castShadow = true;
    leftEye.receiveShadow = true;
    this.mesh.add(leftEye);

    // Create the left Eye
    const geomRightEye = new THREE.BoxGeometry(75, 150, 40, 1, 1, 1);
    const matRightEye = new THREE.MeshPhongMaterial({color: Colors.blueDark});
    const rightEye = new THREE.Mesh(geomRightEye, matRightEye);
    rightEye.position.set(- 45, 0, 150);
    rightEye.castShadow = true;
    rightEye.receiveShadow = true;
    this.mesh.add(rightEye);

    // Create the left Wing
    const geomLeftWing = new THREE.BoxGeometry(180, 20, 240, 1, 1, 1);
    const matLeftWing = new THREE.MeshPhongMaterial({color: Colors.white});
    const leftWing = new THREE.Mesh(geomLeftWing, matLeftWing);
    leftWing.position.set(- 100, 120, - 20);
    leftWing.rotation.x += Math.PI / 16;
    leftWing.rotation.z += Math.PI / - 16;
    leftWing.castShadow = true;
    leftWing.receiveShadow = true;
    this.mesh.add(leftWing);

    // Create the right Wing
    geomRightWing = new THREE.BoxGeometry(180, 20, 240, 1, 1, 1);
    const matRightWing = new THREE.MeshPhongMaterial({color: Colors.white});
    const rightWing = new THREE.Mesh(geomRightWing, matRightWing);
    rightWing.position.set(100, 120, - 20);
    rightWing.rotation.x += Math.PI / 16;
    rightWing.rotation.z += Math.PI / 16;
    rightWing.castShadow = true;
    rightWing.receiveShadow = true;
    this.mesh.add(rightWing);

    // Create the LegOne
    const geomLeg = new THREE.BoxGeometry(200, 10, 30, 1, 1, 1);
    const matLeg = new THREE.MeshPhongMaterial({color: Colors.brownDark});
    const leftLeg = new THREE.Mesh(geomLeg, matLeg);
    leftLeg.position.set(110, - 50, 80);
    leftLeg.rotation.z -= Math.PI / 3;
    leftLeg.rotation.x -= Math.PI / 13;
    leftLeg.castShadow = true;
    leftLeg.receiveShadow = true;
    this.mesh.add(leftLeg);

    // Create the LegTwo
    const geomLegTwo = new THREE.BoxGeometry(200, 10, 30, 1, 1, 1);
    const matLegTwo = new THREE.MeshPhongMaterial({color: Colors.brownDark});
    const leftLegTwo = new THREE.Mesh(geomLegTwo, matLegTwo);
    leftLegTwo.position.set(110, - 50, 60);
    leftLegTwo.rotation.z -= Math.PI / 3;
    leftLegTwo.rotation.x -= Math.PI / - 14;
    leftLegTwo.castShadow = true;
    leftLegTwo.receiveShadow = true;
    this.mesh.add(leftLegTwo);

    // Create the LegThree
    const geomLegThree = new THREE.BoxGeometry(200, 10, 30, 1, 1, 1);
    const matLegThree = new THREE.MeshPhongMaterial({color: Colors.brownDark});
    const leftLegThree = new THREE.Mesh(geomLegThree, matLegThree);
    leftLegThree.position.set(110, - 45, 100);
    leftLegThree.rotation.z -= Math.PI / 3;
    leftLegThree.rotation.x -= Math.PI / 4;
    leftLegThree.castShadow = true;
    leftLegThree.receiveShadow = true;
    this.mesh.add(leftLegThree);

    // Create the RightLegOne
    const geomRightLeg = new THREE.BoxGeometry(200, 10, 30, 1, 1, 1);
    const matRightLeg = new THREE.MeshPhongMaterial({color: Colors.brownDark});
    const rightLeg = new THREE.Mesh(geomRightLeg, matRightLeg);
    rightLeg.position.set(- 110, - 50, 80);
    rightLeg.rotation.z -= Math.PI / - 3;
    rightLeg.rotation.x -= Math.PI / 13;
    rightLeg.castShadow = true;
    rightLeg.receiveShadow = true;
    this.mesh.add(rightLeg);

    // Create the RightLegTwo
    const geomRightLegTwo = new THREE.BoxGeometry(200, 10, 30, 1, 1, 1);
    const matRightLegTwo = new THREE.MeshPhongMaterial({color: Colors.brownDark});
    const rightLegTwo = new THREE.Mesh(geomRightLegTwo, matRightLegTwo);
    rightLegTwo.position.set(- 110, - 50, 60);
    rightLegTwo.rotation.z -= Math.PI / - 3;
    rightLegTwo.rotation.x -= Math.PI / - 14;
    rightLegTwo.castShadow = true;
    rightLegTwo.receiveShadow = true;
    this.mesh.add(rightLegTwo);

    // Create the RightLegThree
    const geomRightLegThree = new THREE.BoxGeometry(200, 10, 30, 1, 1, 1);
    const matRightLegThree = new THREE.MeshPhongMaterial({color: Colors.brownDark});
    const rightLegThree = new THREE.Mesh(geomRightLegThree, matRightLegThree);
    rightLegThree.position.set(- 110, - 45, 100);
    rightLegThree.rotation.z -= Math.PI / - 3;
    rightLegThree.rotation.x -= Math.PI / 4;
    rightLegThree.castShadow = true;
    rightLegThree.receiveShadow = true;
    this.mesh.add(rightLegThree);


    // this.mesh.rotation.x += Math.PI / 2;
    // this.mesh.rotation.x += Math.PI / 16;

  }
}

const createPlane = () => {
  airplane = new AirPlane();
  airplane.mesh.scale.set(.25, .25, .25);
  airplane.mesh.position.y = 100;
  scene.add(airplane.mesh);
};

let mousePos = {x: 0, y: 0};

const loop = () => {
	// Rotate the propeller, the sea and the sky
  renderer.render(scene, camera);
	// call the loop function again
  airplane.mesh.rotation.x = mousePos.y;
  airplane.mesh.rotation.y = mousePos.x;

  requestAnimationFrame(loop);
};

const  handleMouseMove = e => {

	// here we are converting the mouse position value received
	// to a normalized value varying between -1 and 1;
	// this is the formula for the horizontal axis:

  const tx = - 1 + (e.clientX / WIDTH) * 2;

	// for the vertical axis, we need to inverse the formula
	// because the 2D y-axis goes the opposite direction of the 3D y-axis

  const ty = 1 - (e.clientY / HEIGHT) * 2;
  mousePos = {x: tx, y: ty};
};

const init = () => {

  createScene();
  createLights();
  createPlane();
  document.addEventListener(`mousemove`, handleMouseMove, false);

  loop();

  // renderer.render(scene, camera);

};

init();
