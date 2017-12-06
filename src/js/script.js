import * as THREE from 'three';

const Colors = {
  white: new THREE.Color(`rgb(232, 234, 215)`),
  brownDark: new THREE.Color(`rgb(62, 77, 89)`),
  blue: new THREE.Color(`rgb(124, 152, 174)`),
  blueDark: new THREE.Color(`rgb(56, 93, 122)`)

};


let sceneWidth, sceneHeight, camera, scene, renderer, dom;
let sun, rollingGroundSphere;

//sneeuwbal
let heroSphere, heroRollingSpeed;

//snelheid van de grond die beweegt
const rollingSpeed = 0.004;
const heroRadius = 0.2;
const heroBaseY = 1.8;
let bounceValue = 0.1;

const worldRadius = 26;

let sphericalHelper, pathAngleValues;
const gravity = 0.005;
const leftLane = - 1;
const rightLane = 1;
const middleLane = 0;
let currentLane, clock, jumping;
const treeReleaseInterval = 0.5;
//const lastTreeReleaseTime = 0;
let treesInpath, treesPool;

let particleGeometry, particles;
const particleCount = 20;
let explosionPower = 1.06;

let hasCollided;

let midPointVector, vertexVector, vertexIndex, offset;
let currentTier = 1;
let fly;

let mousePos = {x: 0, y: 0};

let factor = 1;
const counter = 61;

const createScene = () => {

  //collision standaard op false
  hasCollided = false;

  //bomen
  treesInpath = [];
  treesPool = [];

  //clock starten
  clock = new THREE.Clock();
  clock.start();

  //rollen van de sneeuwbal
  heroRollingSpeed = (rollingSpeed * worldRadius / heroRadius) / 5;
  sphericalHelper = new THREE.Spherical();
  pathAngleValues = [1.52, 1.57, 1.62];

  sceneWidth = window.innerWidth;
  sceneHeight = window.innerHeight;

  //scene aanmaken
  scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0xf0fff0, 0.14);

  //camera aanmaken
  camera = new THREE.PerspectiveCamera(60, sceneWidth / sceneHeight, 0.1, 1000);

  //renderer
  renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
  });
  renderer.setClearColor(0xfffafa, 1);

  //schaduw
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setSize(sceneWidth, sceneHeight);

  //dom ophalen
  dom = document.getElementById(`world`);
  dom.appendChild(renderer.domElement);

  createTreesPool();
  addWorld();
  addHero();
  addLight();
  addExplosion();

  //camera position
  camera.position.z = 6.5;
  camera.position.y = 2.5;

  //resize callback
  window.addEventListener(`resize`, onWindowResize, false);

  //keys event
  document.onkeydown = handleKeyDown;

  //score logica eventueel
  //...


};

const addExplosion = () => {
  particleGeometry = new THREE.Geometry();
  for (let i = 0;i < particleCount;i ++) {
    const vertex = new THREE.Vector3();
    particleGeometry.vertices.push(vertex);
  }

  const particleMaterial = new THREE.PointsMaterial({
    color: 0xfffafa, size: 0.2
  });
  particles = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particles);
  particles.visible = false;
};

const createTreesPool = () => {
  const maxTreesInPool = 10;
  let newTree;
  for (let i = 0;i < maxTreesInPool;i ++) {
    newTree = createTree();
    treesPool.push(newTree);
  }
};

const handleKeyDown = keyEvent => {
  if (jumping) return;
  let validMove = true;

  //verspringen links-rechts-springen
  //links
  if (keyEvent.keyCode === 37) {
    if (currentLane === middleLane) {
      currentLane = leftLane;
    } else if (currentLane === rightLane) {
      currentLane = middleLane;
    } else {
      validMove = false;
    }
  } else if (keyEvent.keyCode === 39) { //right
    if (currentLane === middleLane) {
      currentLane = rightLane;
    } else if (currentLane === leftLane) {
      currentLane = middleLane;
    } else {
      validMove = false;
    }
  } else {
    if (keyEvent.keyCode === 38) {
      bounceValue = 0.1;
      jumping = true;
    }
    validMove = false;
  }
  if (validMove) {
    jumping = true;
    bounceValue = 0.06;
  }
};

const addHero = () => {
  const sphereGeometry = new THREE.DodecahedronGeometry(heroRadius, 1);
  const sphereMaterial = new THREE.MeshStandardMaterial({color: 0xe5f2f2, flatShading: THREE.FlatShading});
  jumping = false;
  heroSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  heroSphere.receiveShadow = true;
  heroSphere.castShadow = true;

  scene.add(heroSphere);

  heroSphere.position.y = heroBaseY;
  heroSphere.position.z = 4.8;
  currentLane = middleLane;
  heroSphere.position.x = currentLane;
};

const addWorld = () => {
  const sides = 40;
  const tiers = 40;
  const sphereGeometry = new THREE.SphereGeometry(worldRadius, sides, tiers);
  const sphereMaterial = new THREE.MeshStandardMaterial({color: 0xffffafa, flatShading: THREE.FlatShading});

  let vertexIndex;
  let vertexVector = new THREE.Vector3();
  let nextVertexVector = new THREE.Vector3();
  let firstVertexVector = new THREE.Vector3();
  let offset = new THREE.Vector3();
  let lerpValue = 0.5;
  let heightValue;
  const maxHeight = 0.7;

  for (let j = 1;j < tiers - 50;j ++) {
    currentTier = j;
    for (let i = 0;i < sides;i ++) {
      vertexIndex = (currentTier * sides) + 1;
      vertexVector = sphereGeometry.vertices[i + vertexIndex].clone();
      if (j % 2 !== 0) {
        if (i === 0) {
          firstVertexVector = vertexVector.clone();
        }
        nextVertexVector = sphereGeometry.vertices[i + vertexIndex + 1].clone();
        if (i === sides - 1) {
          nextVertexVector = firstVertexVector;
        }
        lerpValue = (Math.random() * (0.75 - 0.25)) + 0.25;
        vertexVector.lerp(nextVertexVector, lerpValue);
      }
      heightValue = (Math.random() * maxHeight) - (maxHeight / 2);
      offset = vertexVector.clone().normalize().multiplyScalar(heightValue);
      sphereGeometry.vertices[i + vertexIndex] = (vertexVector.add(offset));
    }
  }
  rollingGroundSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  rollingGroundSphere.receiveShadow = true;
  rollingGroundSphere.castShadow = false;
  rollingGroundSphere.rotation.z = - Math.PI / 2;
  scene.add(rollingGroundSphere);
  rollingGroundSphere.position.y = - 24;
  rollingGroundSphere.position.z = 2;
  addWorldTrees();
};

const addLight = () => {
  const hemisphereLight = new THREE.HemisphereLight(0xfffafa, 0x000000, .9);
  scene.add(hemisphereLight);
  sun = new THREE.DirectionalLight(0xcdc1c5, 0.9);
  sun.position.set(12, 6, - 7);
  sun.castShadow = true;
  scene.add(sun);
//Set up shadow properties for the sun light
  sun.shadow.mapSize.width = 256;
  sun.shadow.mapSize.height = 256;
  sun.shadow.camera.near = 0.5;
  sun.shadow.camera.far = 50;
};

const addPathTree = () => {
  const options = [0, 1, 2];
  let lane = Math.floor(Math.random() * 3);
  addTree(true, lane);
  options.splice(lane, 1);
  if (Math.random() > 0.5) {
    lane = Math.floor(Math.random() * 2);
    addTree(true, options[lane]);
  }
};

const addWorldTrees = () => {
  const numTrees = 36;
  const gap = 6.28 / 36;
  for (let i = 0;i < numTrees;i ++) {
    addTree(false, i * gap, true);
    addTree(false, i * gap, false);
  }
};

const addTree = (inPath, row, isLeft) => {
  let newTree;
  if (inPath) {
    if (treesPool.length === 0) return;
    newTree = treesPool.pop();
    newTree.visible = true;
		//console.log("add tree");
    treesInpath.push(newTree);
    sphericalHelper.set(worldRadius - 0.3, pathAngleValues[row], - rollingGroundSphere.rotation.x + 4);
  } else {
    newTree = createTree();
    let forestAreaAngle = 0;//[1.52,1.57,1.62];
    if (isLeft) {
      forestAreaAngle = 1.68 + Math.random() * 0.1;
    } else {
      forestAreaAngle = 1.46 - Math.random() * 0.1;
    }
    sphericalHelper.set(worldRadius - 0.3, forestAreaAngle, row);
  }
  newTree.position.setFromSpherical(sphericalHelper);
  const rollingGroundVector = rollingGroundSphere.position.clone().normalize();
  const treeVector = newTree.position.clone().normalize();
  newTree.quaternion.setFromUnitVectors(treeVector, rollingGroundVector);
  newTree.rotation.x += (Math.random() * (2 * Math.PI / 10)) + - Math.PI / 10;

  rollingGroundSphere.add(newTree);

};

const createTree = () => {
  const sides = 8;
  const tiers = 6;
  const scalarMultiplier = (Math.random() * (0.25 - 0.1)) + 0.05;
  midPointVector = new THREE.Vector3();
  vertexVector = new THREE.Vector3();
  const treeGeometry = new THREE.ConeGeometry(0.5, 1, sides, tiers);
  const treeMaterial = new THREE.MeshStandardMaterial({color: 0x33ff33, flatShading: THREE.FlatShading});
  midPointVector = treeGeometry.vertices[0].clone();
  blowUpTree(treeGeometry.vertices, sides, 0, scalarMultiplier);
  tightenTree(treeGeometry.vertices, sides, 1);
  blowUpTree(treeGeometry.vertices, sides, 2, scalarMultiplier * 1.1, true);
  tightenTree(treeGeometry.vertices, sides, 3);
  blowUpTree(treeGeometry.vertices, sides, 4, scalarMultiplier * 1.2);
  tightenTree(treeGeometry.vertices, sides, 5);
  const treeTop = new THREE.Mesh(treeGeometry, treeMaterial);
  treeTop.castShadow = true;
  treeTop.receiveShadow = false;
  treeTop.position.y = 0.9;
  treeTop.rotation.y = (Math.random() * (Math.PI));
  const treeTrunkGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.5);
  const trunkMaterial = new THREE.MeshStandardMaterial({color: 0x886633, flatShading: THREE.FlatShading});
  const treeTrunk = new THREE.Mesh(treeTrunkGeometry, trunkMaterial);
  treeTrunk.position.y = 0.25;
  const tree = new THREE.Object3D();
  tree.add(treeTrunk);
  tree.add(treeTop);
  return tree;
};

const blowUpTree = (vertices, sides, currentTier, scalarMultiplier, odd) => {
  vertexVector = new THREE.Vector3();
  midPointVector = vertices[0].clone();
  for (let i = 0;i < sides;i ++) {
    vertexIndex = (currentTier * sides) + 1;
    vertexVector = vertices[i + vertexIndex].clone();
    midPointVector.y = vertexVector.y;
    offset = vertexVector.sub(midPointVector);
    if (odd) {
      if (i % 2 === 0) {
        offset.normalize().multiplyScalar(scalarMultiplier / 6);
        vertices[i + vertexIndex].add(offset);
      } else {
        offset.normalize().multiplyScalar(scalarMultiplier);
        vertices[i + vertexIndex].add(offset);
        vertices[i + vertexIndex].y = vertices[i + vertexIndex + sides].y + 0.05;
      }
    } else {
      if (i % 2 !== 0) {
        offset.normalize().multiplyScalar(scalarMultiplier / 6);
        vertices[i + vertexIndex].add(offset);
      } else {
        offset.normalize().multiplyScalar(scalarMultiplier);
        vertices[i + vertexIndex].add(offset);
        vertices[i + vertexIndex].y = vertices[i + vertexIndex + sides].y + 0.05;
      }
    }
  }
};

const tightenTree = (vertices, sides, currentTier) => {
  let vertexIndex;
  let vertexVector = new THREE.Vector3();
  const midPointVector = vertices[0].clone();
  let offset;
  for (let i = 0;i < sides;i ++) {
    vertexIndex = (currentTier * sides) + 1;
    vertexVector = vertices[i + vertexIndex].clone();
    midPointVector.y = vertexVector.y;
    offset = vertexVector.sub(midPointVector);
    offset.normalize().multiplyScalar(0.06);
    vertices[i + vertexIndex].sub(offset);
  }
};

class Fly {
  constructor() {
    this.mesh = new THREE.Object3D();

    //body Fly

    const geomBody = new THREE.BoxGeometry(200, 170, 270, 1, 1, 1);
    const matBody = new THREE.MeshPhongMaterial({color: Colors.blue, flatShading: THREE.FlatShading});
    const body = new THREE.Mesh(geomBody, matBody);
    body.castShadow = true;
    body.receiveShadow = true;
    this.mesh.add(body);

    //left eye
    const geomLeftEye = new THREE.BoxGeometry(75, 150, 40, 1, 1, 1);
    const matLeftEye = new THREE.MeshPhongMaterial({color: Colors.blueDark});
    const leftEye = new THREE.Mesh(geomLeftEye, matLeftEye);
    leftEye.position.set(45, 0, 150);
    leftEye.castShadow = true;
    leftEye.receiveShadow = true;
    this.mesh.add(leftEye);

    //right eye
    const geomRightEye = new THREE.BoxGeometry(75, 150, 40, 1, 1, 1);
    const matRightEye = new THREE.MeshPhongMaterial({color: Colors.blueDark});
    const rightEye = new THREE.Mesh(geomRightEye, matRightEye);
    rightEye.position.set(- 45, 0, 150);
    rightEye.castShadow = true;
    rightEye.receiveShadow = true;
    this.mesh.add(rightEye);

    //left wing
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

    //right wing
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
  fly.mesh.scale.set(0.04, 0.04, 0.04);
  fly.mesh.position.y = - 200;
  fly.mesh.position.x = 10;
  fly.mesh.position.z = - 50;
  //perspectief
  fly.mesh.rotation.y = Math.PI;
  fly.mesh.rotation.x = Math.PI / 6;

  scene.add(fly.mesh);

};

const updateFly = () => {
  const targetX = normalize(mousePos.x, - 1, 1, - 100, 100);
  const targetY = normalize(mousePos.y,  - 1, 1, 1, 175);
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


const onWindowResize = () => {
	//resize & align
  sceneHeight = window.innerHeight;
  sceneWidth = window.innerWidth;
  renderer.setSize(sceneWidth, sceneHeight);
  camera.aspect = sceneWidth / sceneHeight;
  camera.updateProjectionMatrix();
};

const update = () => {
  rollingGroundSphere.rotation.x += rollingSpeed;
  heroSphere.rotation.x -= heroRollingSpeed;
  if (heroSphere.position.y <= heroBaseY) {
    jumping = false;
    bounceValue = (Math.random() * 0.04) + 0.005;
  }
  heroSphere.position.y += bounceValue;
  heroSphere.position.x = THREE.Math.lerp(heroSphere.position.x, currentLane, 2 * clock.getDelta());//clock.getElapsedTime());
  bounceValue -= gravity;
  if (clock.getElapsedTime() > treeReleaseInterval) {
    clock.start();
    addPathTree();
    if (!hasCollided) {
      console.log(`geraakt`);
    }
  }
  doTreeLogic();
  doExplosionLogic();

  //animeren vlieg
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

  updateFly();

  render();
  requestAnimationFrame(update);//request next update
};

const updateCounter = () => {
  if (counter > 0) {
    document.getElementById(`counter`).innerHTML = counter;
  } else if (counter === 0) {
    document.getElementById(`counter`).innerHTML = `end game`;
  }
};


const doTreeLogic = () => {
  let oneTree;
  const treePos = new THREE.Vector3();
  const treesToRemove = [];
  treesInpath.forEach(function (element, index) {
    oneTree = treesInpath[ index ];
    treePos.setFromMatrixPosition(oneTree.matrixWorld);
    if (treePos.z > 6 && oneTree.visible) {//gone out of our view zone
      treesToRemove.push(oneTree);
    } else {//check collision
      if (treePos.distanceTo(heroSphere.position) <= 0.6) {
        console.log(`hit`);
        hasCollided = true;
        explode();
      }
    }
  });
  let fromWhere;
  treesToRemove.forEach(function (element, index) {
    oneTree = treesToRemove[ index ];
    fromWhere = treesInpath.indexOf(oneTree);
    treesInpath.splice(fromWhere, 1);
    treesPool.push(oneTree);
    oneTree.visible = false;
    console.log(`remove tree`);
  });
};

const doExplosionLogic = () => {
  if (!particles.visible) return;
  for (let i = 0;i < particleCount;i ++) {
    particleGeometry.vertices[i].multiplyScalar(explosionPower);
  }
  if (explosionPower > 1.005) {
    explosionPower -= 0.001;
  } else {
    particles.visible = false;
  }
  particleGeometry.verticesNeedUpdate = true;
};

const explode = () => {
  particles.position.y = 2;
  particles.position.z = 4.8;
  particles.position.x = heroSphere.position.x;
  for (let i = 0;i < particleCount;i ++) {
    const vertex = new THREE.Vector3();
    vertex.x = - 0.2 + Math.random() * 0.4;
    vertex.y = - 0.2 + Math.random() * 0.4;
    vertex.z = - 0.2 + Math.random() * 0.4;
    particleGeometry.vertices[i] = vertex;
  }
  explosionPower = 1.07;
  particles.visible = true;
};

const handleMouseMove = e => {

  const tx = - 1 + (e.clientX / sceneWidth) * 2;
  const ty = 1 - (e.clientY / sceneHeight) * 2;
  mousePos = {x: tx, y: ty};
};

const render = () => {
  renderer.render(scene, camera);//draw
};

const init = () => {

  createScene();
  createFly();
  document.addEventListener(`mousemove`, handleMouseMove, false);
  setInterval(updateCounter, 1000);
  update();

};

init();
