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
let fly;

let factor = 1;


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

class Fly {
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
    const geomLeftWing = new THREE.BoxGeometry(200, 20, 240, 1, 1, 1);
    geomLeftWing.applyMatrix(new THREE.Matrix4().makeTranslation(0, 20, - 160));

    const matLeftWing = new THREE.MeshPhongMaterial({color: Colors.white});
    const leftWing = new THREE.Mesh(geomLeftWing, matLeftWing);
    leftWing.position.set(- 95, 60, 75);

    geomLeftWing.vertices[1].x -= 50;
    geomLeftWing.vertices[3].x -= 50;

    geomLeftWing.vertices[5].x += 110;
    geomLeftWing.vertices[7].x += 110;
    geomLeftWing.vertices[5].z += 40;
    geomLeftWing.vertices[7].z += 40;


    geomLeftWing.vertices[4].x -= 30;
    geomLeftWing.vertices[6].x -= 30;

    leftWing.castShadow = true;
    leftWing.receiveShadow = true;
    this.mesh.add(leftWing);

    // Create the right Wing
    const geomRightWing = new THREE.BoxGeometry(200, 20, 240, 1, 1, 1);
    geomRightWing.applyMatrix(new THREE.Matrix4().makeTranslation(0, 20, - 160));

    const matRightWing = new THREE.MeshPhongMaterial({color: Colors.white});
    const rightWing = new THREE.Mesh(geomRightWing, matRightWing);
    rightWing.position.set(95, 60, 75);

    geomRightWing.vertices[0].x -= 110;
    geomRightWing.vertices[2].x -= 110;
    geomRightWing.vertices[0].z += 40;
    geomRightWing.vertices[2].z += 40;

    geomRightWing.vertices[4].x += 50;
    geomRightWing.vertices[6].x += 50;

    geomRightWing.vertices[3].x += 30;
    geomRightWing.vertices[1].x += 30;

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

  }
}

const createFly = () => {
  fly = new Fly();
  fly.mesh.scale.set(.05, .05, .05);
  fly.mesh.position.y = 100;
  fly.mesh.rotation.y = Math.PI / 2;
  // fly.mesh.rotation.x = Math.PI / 2;

  scene.add(fly.mesh);
};

let mousePos = {x: 0, y: 0};

const updateFly = () => {
  const targetX = normalize(mousePos.x, - 1, 1, - 100, 100);
  const targetY = normalize(mousePos.y, - 1, 1, 25, 175);

  fly.mesh.position.y = targetY;
  fly.mesh.position.x = targetX;
};

const normalize = (v, vmin, vmax, tmin, tmax) => {

  const nv = Math.max(Math.min(v, vmax), vmin);
  const dv = vmax - vmin;
  const pc = (nv - vmin) / dv;
  const dt = tmax - tmin;
  const tv = tmin + (pc * dt);
  return tv;

};

const loop = () => {


  const leftWing = fly.mesh.children[3];
  const rightWing = fly.mesh.children[4];

  if (factor === 1) {
    if (leftWing.rotation.x > Math.PI / 4) {
      factor = - 1;
    }
  }

  if (factor === - 1) {
    if (leftWing.rotation.x < 0.1) {
      factor = 1;
    }
  }

  leftWing.rotation.x += 0.06 * factor;
  leftWing.rotation.y += 0.01 * factor;
  rightWing.rotation.x += 0.06 * factor;
  rightWing.rotation.y -= 0.01 * factor;

  // rightWing.rotation.y += 0.01 * factor;

  updateFly();
  // fly.mesh.rotation.x = - mousePos.y;
  // fly.mesh.rotation.y = mousePos.x;

  renderer.render(scene, camera);

  requestAnimationFrame(loop);
};

let counter = 61;

const updateCounter = () => {
  console.log(`blob`);
  if (counter > 0) {
    counter --;
    document.getElementById(`counter`).innerHTML = counter;
  } else if (counter === 0) {
    document.getElementById(`counter`).innerHTML = `end game`;
  }
};

const  handleMouseMove = e => {

  const tx = - 1 + (e.clientX / WIDTH) * 2;
  const ty = 1 - (e.clientY / HEIGHT) * 2;
  mousePos = {x: tx, y: ty};
};


const init = () => {

  createScene();
  createLights();
  createFly();
  document.addEventListener(`mousemove`, handleMouseMove, false);
  setInterval(updateCounter, 1000);

  loop();

};

init();
