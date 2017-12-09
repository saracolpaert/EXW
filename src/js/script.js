import * as THREE from 'three';
import Fly from './objects/Fly';

let sceneWidth, sceneHeight;
let scene;
let camera;
let renderer;
let dom;
let sun;

//vlieg
let fly;
const heroBaseY = 1.8;
let mousePos = {x: 0, y: 0};
let factor = 1;

let currentTier = 1;
const worldRadius = 26;
let rollingGroundSphere;
const rollingSpeed = 0.003;

let treesPool, treesInPath;
const treeReleaseInterval = 2;
let sphericalHelper, pathAngleValues;
let vertexIndex, vertexVector, midPointVector, offset;

let clock;

let hasCollided;


const createScene = () => {

  hasCollided = false;

  //bomen
  treesInPath = [];
  treesPool = [];
  sphericalHelper = new THREE.Spherical();
  //angle values for each path on the sphere
  pathAngleValues = [1.52, 1.57, 1.62];

  //clock starten
  clock = new THREE.Clock();
  clock.start();

  sceneWidth = window.innerWidth;
  sceneHeight = window.innerHeight;

  //scene aanmaken
  scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0xf0ff0, 0.14);

  //camera aanmaken
  camera = new THREE.PerspectiveCamera(40, sceneWidth / sceneHeight, 1, 1000);
  camera.position.z = 6.5;
  camera.position.y = 2.5;

  //renderer
  renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
  });
  renderer.setClearColor(0xD2E6F7, 1);

  //schaduw
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setSize(sceneWidth, sceneHeight);

  //dom ophalen
  dom = document.getElementById(`world`);
  dom.appendChild(renderer.domElement);

  //resize callback
  window.addEventListener(`resize`, onWindowResize, false);

  createTreesPool();
  addWorld();
  addLight();


};

const addWorld = () => {

  //aantal zijden wereld
  const sides = 40; //200
  const tiers = 40; //150

  //spehere en material
  const sphereGeometry = new THREE.SphereGeometry(worldRadius, sides, tiers);
  const sphereMaterial = new THREE.MeshStandardMaterial({color: 0xBFBAB0, flatShading: THREE.FlatShading});

  //vormen opbouwen wereld
  let vertexIndex;
  let vertexVector = new THREE.Vector3();
  let nextVertexVector = new THREE.Vector3();
  let firstVertexVector = new THREE.Vector3();
  let offset = new THREE.Vector3();
  let lerpValue = 0.5;
  let heightValue;
  const maxHeight = 0.7;

  for (let j = 1;j < tiers - 50;j ++) { // - 20
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

  //mesh wereld aanmaken
  rollingGroundSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  rollingGroundSphere.receiveShadow = true;
  rollingGroundSphere.castShadow = false;
  rollingGroundSphere.rotation.z = - Math.PI / 2;
  scene.add(rollingGroundSphere);
  rollingGroundSphere.position.y = - 24;
  rollingGroundSphere.position.z = 2;

  //wereld bomen aanmaken
  addWorldTrees();
};

const addLight = () => {

  //licht toevoegen
  const hemisphereLight = new THREE.HemisphereLight(0x907465, 0x000000, 3);
  scene.add(hemisphereLight);

  // zon toevoegen
  sun = new THREE.DirectionalLight(0xDBC0A9, 0.1);
  sun.position.set(0, 8, - 10);
  //sun.castShadow = true;
  scene.add(sun);
  // sun.shadow.mapSize.width = 256;
  // sun.shadow.mapSize.height = 256;
  // sun.shadow.camera.near = 0.5;
  // sun.shadow.camera.far = 50;

};

//to plant trees on the path, we will make use of a pool of trees which are created on start
const createTreesPool = () => {
  const maxTreesInPool = 10;
  let newTree;
  for (let i = 0;i < maxTreesInPool;i ++) {
    newTree = createTree();
    treesPool.push(newTree);
  }
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

//used to expand the alternative ring of vertices outwards
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

//used to shrink down the next ring of vertices
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

// one set of trees is placed outside the rolling track to create the world
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
    treesInPath.push(newTree);
    sphericalHelper.set(worldRadius - 0.3, pathAngleValues[row], - rollingGroundSphere.rotation.x + 4);
  } else {
    newTree = createTree();
    let forestAreaAngle = 0;

    if (isLeft) {
      forestAreaAngle = 1.68 + Math.random() * 0.1;
    } else {
      forestAreaAngle = 1.46 - Math.random() * 0.1;
    }
    sphericalHelper.set(worldRadius - 0.3, forestAreaAngle, row);
  }
  newTree.position.setFromSpherical(sphericalHelper);

  //all the trees are added as a child of the rollingGroundSphere so that they also move when we rotate the sphere.
  const rollingGroundVector = rollingGroundSphere.position.clone().normalize();
  const treeVector = newTree.position.clone().normalize();
  newTree.quaternion.setFromUnitVectors(treeVector, rollingGroundVector);
  newTree.rotation.x += (Math.random() * (2 * Math.PI / 10)) + - Math.PI / 10;

  rollingGroundSphere.add(newTree);

};

//it returns the tree to the pool once it goes out of view
const doTreeLogic = () => {
  let oneTree;
  const treePos = new THREE.Vector3();
  const treesToRemove = [];
  treesInPath.forEach(function (element, index) {
    oneTree = treesInPath[index];
    treePos.setFromMatrixPosition(oneTree.matrixWorld);
    if (treePos.z > 6 && oneTree.visible) {
      treesToRemove.push(oneTree);
    } else { //check collision
      if (treePos.distanceTo(fly.mesh.position) <= 0) {
        console.log(`hit`);
        hasCollided = true;
      }
    }
  });

  let fromWhere;
  treesToRemove.forEach(function (element, index) {
    oneTree = treesToRemove [index];
    fromWhere = treesInPath.indexOf(oneTree);
    treesInPath.splice(fromWhere, 1);
    treesPool.push(oneTree);
    oneTree.visible = false;
    console.log(`remove tree`);
  });
};

//this method is called from update when enought time has elapsed after planting the last tree
const addPathTree = () => {
  const options = [0, 1, 2];
  let lane = Math.floor(Math.random() * 3);
  addTree(true, lane); // calling the addtree method with a different set of parameters where te tree gets placed in the selected path
  options.splice(lane, 1);
  if (Math.random() > 0.5) {
    lane = Math.floor(Math.random() * 2);
    addTree(true, options[lane]);
  }
};


const onWindowResize = () => {
	//resize & align
  sceneHeight = window.innerHeight;
  sceneWidth = window.innerWidth;
  renderer.setSize(sceneWidth, sceneHeight);
  camera.aspect = sceneWidth / sceneHeight;
  camera.updateProjectionMatrix();
};

const createFly = () => {
  fly = new Fly();
  fly.mesh.scale.set(0.005, 0.005, 0.005);
  fly.mesh.position.y = heroBaseY;
  fly.mesh.position.x = 10;
  fly.mesh.position.z = 4.8;
  fly.mesh.rotation.y = Math.PI;
  fly.mesh.rotation.x = Math.PI / 7;
  scene.add(fly.mesh);
};

const updateFly = () => {
  fly.mesh.position.y = mousePos.y + 2.4; //normalize(mousePos.x, - 1, 1, - 100, 100);
  fly.mesh.position.x = mousePos.x + .1;//normalize(mousePos.y,  - 1, 1, 1, 175);
  if (fly.mesh.position.y <= 1.8) { //fly.mesh.position.y = targetY;
    fly.mesh.position.y = 1.9;      //  fly.mesh.position.x = targetX;
  }

};

const handleMouseMove = e => {
  const tx = - 1 + (e.clientX / sceneWidth) * 2;
  const ty  = 1 - (e.clientY / sceneHeight) * 2;
  mousePos = {x: tx, y: ty};
};


const update = () => {

  //wereld animeren
  rollingGroundSphere.rotation.x += rollingSpeed;

  //logica tijd/clock
  if (clock.getElapsedTime() > treeReleaseInterval) {
    clock.start();
    addPathTree();
    if (!hasCollided) {
      console.log(`geraakt`);
    }
  }

  //bomen
  doTreeLogic();

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
  requestAnimationFrame(update);
};

const render = () => {
  renderer.render(scene, camera);
};

const init = () => {

  createScene();
  createFly();
  //orange.mesh.position.z = 4.8;
  document.addEventListener(`mousemove`, handleMouseMove, false);
  update();
};

init();
