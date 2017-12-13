import * as THREE from 'three';
import * as Tone from 'tone';
import Fly from './objects/Fly';
import Apple from './objects/Apple';
import Banana from './objects/Banana';
import Orange from './objects/Orange';
import Grapes from './objects/Grapes';

let sceneWidth, sceneHeight, scene, camera, renderer, dom, sun, game, startInterval;
//vlieg
let fly;
let mousePos = {x: 0, y: 0};
let factor = 1;

//wereld
let currentTier = 1;
const worldRadius = 26;
let rollingGroundSphere;
const rollingSpeed = 0.003;

//bomen
let treesPool, treesInPath;
let sphericalHelper, pathAngleValues;
let vertexIndex, vertexVector, midPointVector, offset;

//appels
let applesPool, applesInPath;
let sphericalHelperApples, applePathAngleValues;

//bananas
let bananasPool, bananasInPath;
let sphericalHelperBananas, bananasPathAngleValues;

//oranges
let orangesPool, orangesInPath;
let sphericalHelperOranges, orangesPathAngleValues;

//grapes
let grapesPool, grapesInPath;
let sphericalHelperGrapes, grapesPathAngleValues;

let clock;

//music
let polySynth, distortion;
let totalMusic;
let collisionApple;

let startTime;

//UI
const replayMessage = document.querySelector(`.replay-button`);
const playMessage = document.querySelector(`.start-button`);

const resetGame = () => {

  game = {
    counter: 30,
    status: `start`
  };
  clearInterval(startInterval);
  hideReplay();
  removeScene();

  dom = document.querySelector(`.world`);
  const counter = document.createElement(`h1`);
  dom.appendChild(counter);
  counter.setAttribute(`id`, `counter`);

  const replay = document.createElement(`button`);
  dom.appendChild(replay);
  replay.innerHTML = `replay`;
  replay.className = `replay-button`;
  replay.setAttribute(`id`, `replay`);
  replay.style.display = `none`;
  replay.addEventListener(`click`, handleReplayClicked);
  createScene();
  createFly();
  music();

};

const removeScene = () => {
  if (scene) {
    scene = null;
    camera = null;
    dom = document.querySelector(`.world`);
    empty(dom);
  }
};

const empty = elem => {
  while (elem.lastChild) elem.removeChild(elem.lastChild);
};

const createScene = () => {

  totalMusic = [];

  //bomen
  treesInPath = [];
  treesPool = [];
  sphericalHelper = new THREE.Spherical();
  //angle values for each path on the sphere
  pathAngleValues = [1.52, 1.62];

  //appels
  applesInPath = [];
  applesPool = [];
  sphericalHelperApples = new THREE.Spherical();
  applePathAngleValues = [1.52, 1.53, 1.54, 1.55, 1.56, 1.57, 1.58, 1.59, 1.60, 1.61, 1.62];

  //bananas
  bananasInPath = [];
  bananasPool = [];
  sphericalHelperBananas = new THREE.Spherical();
  bananasPathAngleValues = [1.52, 1.53, 1.54, 1.55, 1.56, 1.57, 1.58, 1.59, 1.60, 1.61, 1.62];

  //oranges
  orangesInPath = [];
  orangesPool = [];
  sphericalHelperOranges = new THREE.Spherical();
  orangesPathAngleValues = [1.52, 1.53, 1.54, 1.55, 1.56, 1.57, 1.58, 1.59, 1.60, 1.61, 1.62];

  //grapes
  grapesInPath = [];
  grapesPool = [];
  sphericalHelperGrapes = new THREE.Spherical();
  grapesPathAngleValues = [1.52, 1.53, 1.54, 1.55, 1.56, 1.57, 1.58, 1.59, 1.60, 1.61, 1.62];

  //clock starten
  clock = new THREE.Clock();
  //clock.start();
  const d = new Date();
  startTime = d.getTime();

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
  dom = document.querySelector(`.world`);
  dom.appendChild(renderer.domElement);

  //resize callback
  window.addEventListener(`resize`, onWindowResize, false);

  createTreesPool();
  createApplesPool();
  createBananasPool();
  createOrangesPool();
  createGrapesPool();
  addWorld();
  addLight();
};

const addWorld = () => {

  //aantal zijden wereld
  const sides = 40; //200
  const tiers = 40; //150

  //spehere en material
  const sphereGeometry = new THREE.SphereGeometry(worldRadius, sides, tiers);
  const sphereMaterial = new THREE.MeshStandardMaterial({color: 0xBFBAB0, flatShading: true});

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
  addWorldApples();
  addWorldBananas();
  addWorldOranges();
  addWorldGrapes();


};

const addLight = () => {

  //licht toevoegen
  const hemisphereLight = new THREE.HemisphereLight(0x907465, 0x000000, 3);
  scene.add(hemisphereLight);

  // zon toevoegen
  sun = new THREE.DirectionalLight(0xDBC0A9, 0.1);
  sun.position.set(0, 8, - 10);
  scene.add(sun);
};

//to plant trees on the path, extra bomen buiten diegene die worden aangemaak in addWorldTrees voor het begin
const createTreesPool = () => {
  const maxTreesInPool = 5;
  let newTree;
  for (let i = 0;i < maxTreesInPool;i ++) {
    newTree = createTree();
    treesPool.push(newTree);
  }
};

const createApplesPool = () => {
  const maxApplesInPool = 10;
  let newApple;
  for (let i = 0;i < maxApplesInPool;i ++) {
    newApple = createApple();
    applesPool.push(newApple);
  }
};

const createBananasPool = () => {
  const maxBananasInPool = 10;
  let newBanana;
  for (let i = 0;i < maxBananasInPool;i ++) {
    newBanana = createBanana();
    bananasPool.push(newBanana);
  }
};

const createOrangesPool = () => {
  const maxOrangesInPool = 10;
  let newOrange;
  for (let i = 0;i < maxOrangesInPool;i ++) {
    newOrange = createOrange();
    orangesPool.push(newOrange);
  }
};

const createGrapesPool = () => {
  const maxGrapesInPool = 10;
  let newGrapes;
  for (let i = 0;i < maxGrapesInPool;i ++) {
    newGrapes = createGrapes();
    grapesPool.push(newGrapes);
  }
};

const createTree = () => {
  const sides = 8;
  const tiers = 6;
  const scalarMultiplier = (Math.random() * (0.25 - 0.1)) + 0.05;
  midPointVector = new THREE.Vector3();
  vertexVector = new THREE.Vector3();
  const treeGeometry = new THREE.ConeGeometry(0.5, 1, sides, tiers);
  const treeMaterial = new THREE.MeshStandardMaterial({color: 0x33ff33, flatShading: true});
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
  const trunkMaterial = new THREE.MeshStandardMaterial({color: 0x886633, flatShading: true});
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

const createApple = () => {
  const apple = new Apple();
  apple.mesh.scale.set(0.02, 0.02, 0.02);
  return apple;
};

const createBanana = () => {
  const banana = new Banana();
  banana.mesh.scale.set(0.02, 0.02, 0.02);
  return banana;
};

const createOrange = () => {
  const orange = new Orange();
  orange.mesh.scale.set(0.03, 0.03, 0.03);
  return orange;
};

const createGrapes = () => {
  const grapes = new Grapes();
  grapes.mesh.scale.set(0.02, 0.02, 0.02);
  return grapes;
};

// one set of trees is placed outside the rolling track to create the world
const addWorldTrees = () => {
  const numTrees = 10;
  const gap = 1;
  for (let i = 0;i < numTrees;i ++) {
    addTree(false, i * gap, true);
    addTree(false, i * gap, false);
  }
};

const addWorldApples = () => {
  const numApples = 20;
  const gap = 8 / 3;
  for (let i = 0;i < numApples;i ++) {
    addApple(false, i * gap, true);
    addApple(false, i * gap, false);
  }
};

const addWorldBananas = () => {
  const numBananas = 5;
  const gap = 6 / 3;
  for (let i = 0;i < numBananas;i ++) {
    addBanana(false, i * gap, true);
    addBanana(false, i * gap, false);
  }
};

const addWorldOranges = () => {
  const numOranges = 5;
  const gap = 4 / 3;
  for (let i = 0;i < numOranges;i ++) {
    addOrange(false, i * gap, true);
    addOrange(false, i * gap, false);
  }
};

const addWorldGrapes = () => {
  const numGrapes = 5;
  const gap = 4 / 3;
  for (let i = 0;i < numGrapes;i ++) {
    addGrapes(false, i * gap, true);
    addGrapes(false, i * gap, false);
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

const addApple = (inPath, row, isLeft) => {
  let newApple;
  if (inPath) {
    if (applesPool.length === 0) return;
    newApple = applesPool.pop();
    newApple.visible = true;
    applesInPath.push(newApple);
    sphericalHelperApples.set(worldRadius - .7 + Math.random() * 1.5, applePathAngleValues[row], - rollingGroundSphere.rotation.x + 4);
  } else {
    newApple = createApple();
    let appleAreaAngle = 0;

    if (isLeft) {
      appleAreaAngle = 1.68 + Math.random() * 0.1;
    } else {
      appleAreaAngle = 1.46 - Math.random() * 0.1;
    }
    sphericalHelperApples.set(worldRadius - .7 + Math.random() * 1.5, appleAreaAngle, row);
  }
  newApple.mesh.position.setFromSpherical(sphericalHelperApples);
  const rollingGroundVector = rollingGroundSphere.position.clone().normalize();
  const appleVector = newApple.mesh.position.clone().normalize();
  newApple.mesh.quaternion.setFromUnitVectors(appleVector, rollingGroundVector);
  newApple.mesh.rotation.x += (Math.random() * (2 * Math.PI / 10)) + - Math.PI / 10;
  rollingGroundSphere.add(newApple.mesh);

};

const addBanana = (inPath, row, isLeft) => {
  let newBanana;
  if (inPath) {
    if (applesPool.length === 0) return;
    newBanana = bananasPool.pop();
    newBanana.visible = true;
    bananasInPath.push(newBanana);
    sphericalHelperBananas.set(worldRadius - 0.3, bananasPathAngleValues[row], - rollingGroundSphere.rotation.x + 4);
  } else {
    newBanana = createBanana();
    let bananaAreaAngle = 0;

    if (isLeft) {
      bananaAreaAngle = 1.68 + Math.random() * 0.1;
    } else {
      bananaAreaAngle = 1.46 - Math.random() * 0.1;
    }
    sphericalHelperBananas.set(worldRadius - 0.3, bananaAreaAngle, row);
  }
  newBanana.mesh.position.setFromSpherical(sphericalHelperBananas);
  const rollingGroundVector = rollingGroundSphere.position.clone().normalize();
  const bananaVector = newBanana.mesh.position.clone().normalize();
  newBanana.mesh.quaternion.setFromUnitVectors(bananaVector, rollingGroundVector);
  newBanana.mesh.rotation.x += (Math.random() * (2 * Math.PI / 10)) + - Math.PI / 10;
  rollingGroundSphere.add(newBanana.mesh);
};

const addOrange = (inPath, row, isLeft) => {
  let newOrange;
  if (inPath) {
    if (orangesPool.length === 0) return;
    newOrange = orangesPool.pop();
    newOrange.visible = true;
    orangesInPath.push(newOrange);
    sphericalHelperOranges.set(worldRadius + .1 + Math.random() * 1.2, orangesPathAngleValues[row], - rollingGroundSphere.rotation.x + 4);
  } else {
    newOrange = createOrange();
    let orangeAreaAngle = 0;

    if (isLeft) {
      orangeAreaAngle = 1.68 + Math.random() * 0.1;
    } else {
      orangeAreaAngle = 1.46 - Math.random() * 0.1;
    }
    sphericalHelperOranges.set(worldRadius - .7 + Math.random() * 1.5, orangeAreaAngle, row);
  }
  newOrange.mesh.position.setFromSpherical(sphericalHelperOranges);

  const rollingGroundVector = rollingGroundSphere.position.clone().normalize();
  const orangeVector = newOrange.mesh.position.clone().normalize();
  newOrange.mesh.quaternion.setFromUnitVectors(orangeVector, rollingGroundVector);
  newOrange.mesh.rotation.x += (Math.random() * (2 * Math.PI / 10)) + - Math.PI / 10;
  rollingGroundSphere.add(newOrange.mesh);
};

const addGrapes = (inPath, row, isLeft) => {
  let newGrapes;
  if (inPath) {
    if (grapesPool.length === 0) return;
    newGrapes = grapesPool.pop();
    newGrapes.visible = true;
    grapesInPath.push(newGrapes);
    sphericalHelperGrapes.set(worldRadius - .3 + Math.random() * 1.5, grapesPathAngleValues[row], - rollingGroundSphere.rotation.x + 4);
  } else {
    newGrapes = createGrapes();
    let grapesAreaAngle = 0;

    if (isLeft) {
      grapesAreaAngle = 1.68 + Math.random() * 0.1;
    } else {
      grapesAreaAngle = 1.46 - Math.random() * 0.1;
    }
    sphericalHelperGrapes.set(worldRadius - .7 + Math.random() * 1.5, grapesAreaAngle, row);
  }
  newGrapes.mesh.position.setFromSpherical(sphericalHelperGrapes);

  const rollingGroundVector = rollingGroundSphere.position.clone().normalize();
  const grapesVector = newGrapes.mesh.position.clone().normalize();
  newGrapes.mesh.quaternion.setFromUnitVectors(grapesVector, rollingGroundVector);
  newGrapes.mesh.rotation.x += (Math.random() * (2 * Math.PI / 10)) + - Math.PI / 10;
  rollingGroundSphere.add(newGrapes.mesh);
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
      }
    }
  });

  let fromWhere;
  treesToRemove.forEach(function (element, index) {
    oneTree = treesToRemove[index];
    fromWhere = treesInPath.indexOf(oneTree);
    treesInPath.splice(fromWhere, 1);
    treesPool.push(oneTree);
    oneTree.visible = false;
  });
};

const music = () => {

  let oneApple;
  const applePos = new THREE.Vector3();
  applesInPath.forEach(function (element, index) {
    oneApple = applesInPath[index];
    applePos.setFromMatrixPosition(oneApple.mesh.matrixWorld);
  });
  distortion = new Tone.Distortion(1 + applePos.x / 4);
  polySynth = new Tone.PolySynth(4, Tone.Synth).chain(distortion, Tone.Master);
};

const appleMusic = () => {
  polySynth = new Tone.PolySynth(4, Tone.Synth).chain(distortion, Tone.Master);
  const sound = polySynth.triggerAttackRelease(`C4`, `8n`);
  const currentTime = new Date().getTime();
  const time = currentTime - startTime;
  const detail = {sound, time};
  totalMusic.push(detail);
};

const doAppleLogic = () => {
  let oneApple;
  const applePos = new THREE.Vector3();
  const applesToRemove = [];
  applesInPath.forEach(function (element, index) {
    oneApple = applesInPath[index];
    applePos.setFromMatrixPosition(oneApple.mesh.matrixWorld);
    distortion = new Tone.Distortion(1 + applePos.x / 4);

    if (applePos.z > 6 && oneApple.visible) {
      applesToRemove.push(oneApple);
    } else {

      const firstBB = new THREE.Box3().setFromObject(fly.mesh);
      const secondBB = new THREE.Box3().setFromObject(oneApple.mesh);
      const collision = firstBB.intersectsBox(secondBB);
      if (collision === true) {
        collisionApple = true;
      }
    }
  });

  let fromWhere;
  applesToRemove.forEach(function (element, index) {
    oneApple = applesToRemove[index];
    fromWhere = applesInPath.indexOf(oneApple);
    applesInPath.splice(fromWhere, 1);
    applesPool.push(oneApple);
    oneApple.visible = false;
  });
};

const doBananaLogic = () => {
  let oneBanana;
  const bananaPos = new THREE.Vector3();
  const bananasToRemove = [];
  bananasInPath.forEach(function (element, index) {
    oneBanana = bananasInPath[index];
    bananaPos.setFromMatrixPosition(oneBanana.mesh.matrixWorld);
    if (bananaPos.z > 6 && oneBanana.visible) {
      bananasToRemove.push(oneBanana);
    } else {
      const firstBB = new THREE.Box3().setFromObject(fly.mesh);
      const secondBB = new THREE.Box3().setFromObject(oneBanana.mesh);
      const collision = firstBB.intersectsBox(secondBB);
      if (collision === true) {
        const sound = polySynth.triggerAttackRelease(`B3`, `8n`);
        const currentTime = new Date().getTime();
        const time = currentTime - startTime;
        const detail = {sound, time};
        totalMusic.push(detail);
      }
    }
  });

  let fromWhere;
  bananasToRemove.forEach(function (element, index) {
    oneBanana = bananasToRemove[index];
    fromWhere = bananasInPath.indexOf(oneBanana);
    bananasInPath.splice(fromWhere, 1);
    bananasPool.push(oneBanana);
    oneBanana.visible = false;
  });
};

const doOrangeLogic = () => {
  let oneOrange;
  const orangePos = new THREE.Vector3();
  const orangesToRemove = [];
  orangesInPath.forEach(function (element, index) {
    oneOrange = orangesInPath[index];
    orangePos.setFromMatrixPosition(oneOrange.mesh.matrixWorld);
    if (orangePos.z > 6 && oneOrange.visible) {
      orangesToRemove.push(oneOrange);
    } else {
      const firstBB = new THREE.Box3().setFromObject(fly.mesh);
      const secondBB = new THREE.Box3().setFromObject(oneOrange.mesh);
      const collision = firstBB.intersectsBox(secondBB);
      if (collision === true) {
        const sound = polySynth.triggerAttackRelease(`E4`, `8n`);
        const currentTime = new Date().getTime();
        const time = currentTime - startTime;
        const detail = {sound, time};
        totalMusic.push(detail);
      }
    }
  });

  let fromWhere;
  orangesToRemove.forEach(function (element, index) {
    oneOrange = orangesToRemove[index];
    fromWhere = orangesInPath.indexOf(oneOrange);
    orangesInPath.splice(fromWhere, 1);
    orangesPool.push(oneOrange);
    oneOrange.visible = false;
  });
};

const doGrapesLogic = () => {
  let oneGrapes;
  const grapesPos = new THREE.Vector3();
  const grapesToRemove = [];
  grapesInPath.forEach(function (element, index) {
    oneGrapes = grapesInPath[index];
    grapesPos.setFromMatrixPosition(oneGrapes.mesh.matrixWorld);
    if (grapesPos.z > 6 && oneGrapes.visible) {
      grapesToRemove.push(oneGrapes);
    } else {
      const firstBB = new THREE.Box3().setFromObject(fly.mesh);
      const secondBB = new THREE.Box3().setFromObject(oneGrapes.mesh);
      const collision = firstBB.intersectsBox(secondBB);
      if (collision === true) {
        const sound = polySynth.triggerAttackRelease(`D6`, `16n`);
        const currentTime = new Date().getTime();
        const time = currentTime - startTime;
        const detail = {sound, time};
        totalMusic.push(detail);
      }
    }
  });

  let fromWhere;
  grapesToRemove.forEach(function (element, index) {
    oneGrapes = grapesToRemove[index];
    fromWhere = grapesInPath.indexOf(oneGrapes);
    grapesInPath.splice(fromWhere, 1);
    grapesPool.push(oneGrapes);
    oneGrapes.visible = false;
  });
};

//this method is called from update when enought time has elapsed after planting the last tree
const addPathTree = () => {
  const options = [0, 1];
  let lane = Math.floor(Math.random() * 2);
  addTree(true, lane); // calling the addtree method with a different set of parameters where te tree gets placed in the selected path
  options.splice(lane, 1);
  if (Math.random() > 0.5) {
    lane = Math.floor(Math.random() * 2);
    addTree(true, options[lane]);
  }
};

const addPathApple = () => {
  const options = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const lane = Math.floor(Math.random() * 10);
  addApple(true, lane);
  options.splice(lane, 1);
};

const addPathBanana = () => {
  const options = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const lane = Math.floor(Math.random() * 10);
  addBanana(true, lane);
  options.splice(lane, 1);
};

const addPathOrange = () => {
  const options = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const lane = Math.floor(Math.random() * 10);
  addOrange(true, lane);
  options.splice(lane, 1);
};

const addPathGrapes = () => {
  const options = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const lane = Math.floor(Math.random() * 10);
  addGrapes(true, lane);
  options.splice(lane, 1);
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
  fly.mesh.position.y = 1.8;
  fly.mesh.position.x = 10;
  fly.mesh.position.z = 4.8;
  fly.mesh.rotation.y = Math.PI;
  fly.mesh.rotation.x = Math.PI / 7;
  scene.add(fly.mesh);
};

const updateFly = () => {
  fly.mesh.position.y = mousePos.y + 2.4;
  fly.mesh.position.x = mousePos.x + .1;
  if (fly.mesh.position.y <= 1.8) {
    fly.mesh.position.y = 1.9;
  }

};

const handleMouseMove = e => {
  const tx = - 1 + (e.clientX / sceneWidth) * 2;
  const ty  = 1 - (e.clientY / sceneHeight) * 2;
  mousePos = {x: tx, y: ty};
};

const handleStartClicked = () => {
  document.getElementById(`counter`).innerHTML = game.counter;
  game.status = `playing`;
  hidePlay();
  startInterval = setInterval(updateCounter, 1000);
};

const handleReplayClicked = () => {
  resetGame();
  document.getElementById(`counter`).innerHTML = game.counter;
  game.status = `playing`;
  startInterval = setInterval(updateCounter, 1000);
};

const endGame = () => {
  document.getElementById(`counter`).innerHTML = `end game`;
  hidePlay();
  showReplay();
  game.status = `waitingreplay`;
  for (let i = scene.children.length - 1;i >= 0;i --) {
    if (scene.children[i].type === `Mesh`)
      scene.remove(scene.children[i]);
  }
  // totalMusic.forEach(sound => {
  //   console.log(sound);
  //   // sound.sound.triggerAttackRelease;
  // });
};

const updateCounter = () => {
  if (game.counter > 0) {
    game.counter --;
    document.getElementById(`counter`).innerHTML = game.counter;
    hideReplay();
  } else if (game.counter === 0) {
    endGame();
  }
};

const hidePlay = () => {
  document.querySelector(`.start-game`).style.display = `none`;
  playMessage.style.display = `none`;
};

const showReplay = () => {
  document.getElementById(`replay`).style.display = `flex`;
};

const hideReplay = () => {
  replayMessage.style.display = `none`;
};


const update = () => {

  if (collisionApple === true) {
    appleMusic();
    collisionApple = false;
  }

  if (game.status === `playing`) {
  //wereld animeren
    rollingGroundSphere.rotation.x += rollingSpeed;


  //logica tijd/clock / releaseinterval
    if (clock.getElapsedTime() > .5) {
      const random = 1 + Math.floor(Math.random() * 4);
      if (random === 1 || random === 4) {
        addPathApple();
      }
      if (random === 2 || random === 4) {
        addPathBanana();
      }
      if (random === 3 || random === 2) {
        addPathOrange();
      }
      if (random === 4 || random === 3) {
        addPathGrapes();
      }
      addPathTree();
      clock.start();
    }

  //bomen en fruit
    doTreeLogic();
    doAppleLogic();
    doBananaLogic();
    doOrangeLogic();
    doGrapesLogic();

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
  }

  // console.log(totalMusic);
  render();
  requestAnimationFrame(update);
};

const render = () => {
  renderer.render(scene, camera);
};

const init = () => {
  resetGame();
  createFly();
  music();
  document.addEventListener(`mousemove`, handleMouseMove, false);
  playMessage.addEventListener(`click`, handleStartClicked);
  update();
};

init();
