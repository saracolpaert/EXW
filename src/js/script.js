import * as THREE from 'three';
import * as Tone from 'tone';

//objects
import Fly from './objects/Fly';
import Apple from './objects/Apple';
import Banana from './objects/Banana';
import Orange from './objects/Orange';
import Grapes from './objects/Grapes';
import Mushroom1 from './objects/Mushroom1';
import Mushroom2 from './objects/Mushroom2';
import Mushroom3 from './objects/Mushroom3';
import Rups from './objects/Rups';
import Tak1 from './objects/Tak1';
import Tak2 from './objects/Tak2';
import Tak3 from './objects/Tak3';
import Tak4 from './objects/Tak4';
import Tak5 from './objects/Tak5';


//functions
import addPath from './lib/addPath';
import createPool from './lib/createPool';
import addWorldObjects from './lib/addWorldObjects';
import addFruits from './lib/addFruits';

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

//mushrooms
let mushroomPool, mushroomsInPath;
let sphericalHelperMushrooms;
let pathAngleValuesMushrooms;

let mushroomPool2, mushroomsInPath2;
let sphericalHelperMushrooms2, pathAngleValuesMushrooms2;

let mushroomPool3, mushroomsInPath3;
let sphericalHelperMushrooms3, pathAngleValuesMushrooms3;

//Rups
let rupsPool, rupsInPath;
let sphericalHelperRups, pathAngleValuesRups;

//takken
let takPool, takInPath;
let sphericalHelperTak, pathAngleValuesTak;

let takPool2, takInPath2;
let sphericalHelperTak2, pathAngleValuesTak2;

let takPool3, takInPath3;
let sphericalHelperTak3, pathAngleValuesTak3;

let takPool4, takInPath4;
let sphericalHelperTak4, pathAngleValuesTak4;

let takPool5, takInPath5;
let sphericalHelperTak5, pathAngleValuesTak5;


//fruits
let fruitPathAngleValues;
let applesPool, applesInPath, bananasPool, bananasInPath, orangesPool, orangesInPath, grapesPool, grapesInPath;
let sphericalHelperApples, sphericalHelperBananas, sphericalHelperOranges, sphericalHelperGrapes;


let clock, time, mushclock;

//music
let polySynth, distortion, volume, pingPong, notes;
const toonApple = `C4`;
const toonBanana = `F3`;
const toonOrange = `D3`;
const toonGrapes = `E4`;

//collision
let flyBox;
let collisionObject;
let lastCollObject = collisionObject;

//UI
const playMessage = document.querySelector(`.start-button`);

const resetGame = () => {
  game = {
    counter: 60,
    status: `start`,
    fov: `nozoom`,
    fly: `flying`,
    rolling: `normal`,
    music: `nomusic`
  };
  clearInterval(startInterval);
  removeScene();
  hideReplay();
  dom = document.querySelector(`.world`);
  const counter = document.createElement(`h1`);
  dom.appendChild(counter);
  counter.setAttribute(`class`, `counter`);

  const endButtons = document.querySelector(`.end-buttons`);
  const replay = document.createElement(`button`);
  endButtons.appendChild(replay);
  replay.innerHTML = `play again`;
  replay.className = `replay-button`;
  replay.setAttribute(`id`, `replay`);
  replay.style.display = `none`;
  replay.addEventListener(`click`, handleReplayClicked);
  const playSong = document.querySelector(`.playsong-button`);
  playSong.addEventListener(`click`, handlePlaySong);
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

  notes = [];
  Tone.Transport.stop();

  //mushrooms
  mushroomPool = [];
  mushroomsInPath = [];
  sphericalHelperMushrooms = new THREE.Spherical();
  pathAngleValuesMushrooms = [1.58, 1.59, 1.60, 1.61, 1.62];

  //mushrooms2
  mushroomPool2 = [];
  mushroomsInPath2 = [];
  sphericalHelperMushrooms2 = new THREE.Spherical();
  pathAngleValuesMushrooms2 = [1.52, 1.53, 1.54, 1.55, 1.56];

  //mushrooms3
  mushroomPool3 = [];
  mushroomsInPath3 = [];
  sphericalHelperMushrooms3 = new THREE.Spherical();
  pathAngleValuesMushrooms3 = [1.56, 1.57, 1.58, 1.59, 1.60];

  //rups
  rupsPool = [];
  rupsInPath = [];
  sphericalHelperRups = new THREE.Spherical();
  pathAngleValuesRups = [1.56, 1.57];

  //takken
  takPool = [];
  takInPath = [];
  sphericalHelperTak = new THREE.Spherical();
  pathAngleValuesTak = [1.56, 1.57, 1.58];

  takPool2 = [];
  takInPath2 = [];
  sphericalHelperTak2 = new THREE.Spherical();
  pathAngleValuesTak2 = [1.56, 1.57, 1.58];

  takPool3 = [];
  takInPath3 = [];
  sphericalHelperTak3 = new THREE.Spherical();
  pathAngleValuesTak3 = [1.56, 1.57, 1.58];

  takPool4 = [];
  takInPath4 = [];
  sphericalHelperTak4 = new THREE.Spherical();
  pathAngleValuesTak4 = [1.56, 1.57, 1.58];

  takPool5 = [];
  takInPath5 = [];
  sphericalHelperTak5 = new THREE.Spherical();
  pathAngleValuesTak5 = [1.56, 1.57, 1.58];

  //fruitPathAngleValues
  fruitPathAngleValues = [1.52, 1.53, 1.54, 1.55, 1.56, 1.57, 1.58, 1.59, 1.60, 1.61, 1.62];

  //appels
  applesInPath = [];
  applesPool = [];
  sphericalHelperApples = new THREE.Spherical();

  //bananas
  bananasInPath = [];
  bananasPool = [];
  sphericalHelperBananas = new THREE.Spherical();

  //oranges
  orangesInPath = [];
  orangesPool = [];
  sphericalHelperOranges = new THREE.Spherical();

  //grapes
  grapesInPath = [];
  grapesPool = [];
  sphericalHelperGrapes = new THREE.Spherical();


  //clock starten
  time = new THREE.Clock();
  clock = new THREE.Clock();
  mushclock = new THREE.Clock();

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

  createPools();
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
  const maxHeight = 0;

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

  //wereld objecten aanmaken
  addAllWorldsObjects();

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

// extra objecten buiten diegene die worden aangemaak in addWorldTrees voor het begin
const createPools = () => {
  createPool(createApple, applesPool, 50);
  createPool(createBanana, bananasPool, 50);
  createPool(createOrange, orangesPool, 50);
  createPool(createGrapes, grapesPool, 50);
  createPool(createMushroom, mushroomPool, 20);
  createPool(createMushroom2, mushroomPool2, 20);
  createPool(createMushroom3, mushroomPool3, 20);
  createPool(createRups, rupsPool, 10);
  createPool(createTak, takPool, 10);
  createPool(createTak2, takPool2, 20);
  createPool(createTak3, takPool3, 10);
  createPool(createTak4, takPool4, 10);
  createPool(createTak5, takPool5, 20);
};

const createMushroom = () => {
  const mushroom = new Mushroom1();
  mushroom.mesh.scale.set(.6, .6, .6);
  return mushroom;
};

const createMushroom2 = () => {
  const mushroom2 = new Mushroom2();
  mushroom2.mesh.scale.set(.2, .2, .2);
  return mushroom2;
};

const createMushroom3 = () => {
  const mushroom3 = new Mushroom3();
  mushroom3.mesh.scale.set(.6, .6, .6);
  return mushroom3;
};

const createRups = () => {
  const rups = new Rups();
  rups.mesh.scale.set(.01, .01, .01);
  return rups;
};

const createTak = () => {
  const tak = new Tak1();
  tak.mesh.scale.set(.09, .09, .09);
  return tak;
};

const createTak2 = () => {
  const tak2 = new Tak2();
  tak2.mesh.scale.set(.09, .09, .09);
  return tak2;
};

const createTak3 = () => {
  const tak3 = new Tak3();
  tak3.mesh.scale.set(.09, .09, .09);
  return tak3;
};

const createTak4 = () => {
  const tak4 = new Tak4();
  tak4.mesh.scale.set(.09, .09, .09);
  return tak4;
};

const createTak5 = () => {
  const tak5 = new Tak5();
  tak5.mesh.scale.set(.09, .09, .09);
  return tak5;
};

const createApple = () => {
  const apple = new Apple();
  const random = 0.005 + Math.random() * 0.03;
  apple.mesh.scale.set(random, random, random);
  return apple;
};

const createBanana = () => {
  const banana = new Banana();
  const random = 0.005 + Math.random() * 0.03;
  banana.mesh.scale.set(random, random, random);
  return banana;
};

const createOrange = () => {
  const orange = new Orange();
  const random = 0.005 + Math.random() * 0.03;
  orange.mesh.scale.set(random, random, random);
  return orange;
};

const createGrapes = () => {
  const grapes = new Grapes();
  const random = 0.005 + Math.random() * 0.03;
  grapes.mesh.scale.set(random, random, random);
  return grapes;
};


// one set of trees is placed outside the rolling track to create the world
const addAllWorldsObjects = () => {
  addWorldObjects(20, 8, 3, addApple);
  addWorldObjects(5, 6, 3, addBanana);
  addWorldObjects(5, 4, 3, addOrange);
  addWorldObjects(5, 4, 3, addGrapes);
  addWorldObjects(10, 8, 3, addMushroom);
  addWorldObjects(10, 1, 1, addMushroom2);
  addWorldObjects(10, 2, 3, addMushroom3);
  addWorldObjects(10, 1, 1, addRups);
  addWorldObjects(10, 8, 3, addTak);
  addWorldObjects(10, 8, 3, addTak2);
  addWorldObjects(10, 8, 3, addTak3);
  addWorldObjects(10, 8, 3, addTak4);
  addWorldObjects(10, 8, 3, addTak5);
};


const addMushroom = (inPath, row, isLeft) => {
  let newMushroom;
  if (inPath) {
    if (mushroomPool.length === 0) return;
    newMushroom = mushroomPool.pop();
    newMushroom.visible = true;
    mushroomsInPath.push(newMushroom);
    sphericalHelperMushrooms.set(worldRadius - .3, pathAngleValuesMushrooms[row], - rollingGroundSphere.x + 10);
  } else {
    newMushroom = createMushroom();
    let forestAreaAngle = 0;

    if (isLeft) {
      forestAreaAngle = 1.68 + Math.random() * 0.5;
    } else {
      forestAreaAngle = 1.46 - Math.random() * 0.4;
    }
    sphericalHelperMushrooms.set(worldRadius - 0.3, forestAreaAngle, row);
  }
  newMushroom.mesh.position.setFromSpherical(sphericalHelperMushrooms);

  const rollingGroundVector = rollingGroundSphere.position.clone().normalize();
  const mushroomVector = newMushroom.mesh.position.clone().normalize();
  newMushroom.mesh.quaternion.setFromUnitVectors(mushroomVector, rollingGroundVector);
  newMushroom.mesh.rotation.x = (Math.random() * (2 * Math.PI / 20)) + - Math.PI / 20;

  rollingGroundSphere.add(newMushroom.mesh);
};

const addMushroom2 = (inPath, row, isLeft) => {
  let newMushroom2;
  if (inPath) {
    if (mushroomPool2.length === 0) return;
    newMushroom2 = mushroomPool2.pop();
    newMushroom2.visible = true;
    mushroomsInPath2.push(newMushroom2);
    sphericalHelperMushrooms2.set(worldRadius - .3, pathAngleValuesMushrooms2[row], - rollingGroundSphere.x + 10);
  } else {
    newMushroom2 = createMushroom2();
    let forestAreaAngle = 0;

    if (isLeft) {
      forestAreaAngle = 1.68 + Math.random() * 0.5;
    } else {
      forestAreaAngle = 1.46 - Math.random() * 0.4;
    }
    sphericalHelperMushrooms2.set(worldRadius - 0.3, forestAreaAngle, row);
  }
  newMushroom2.mesh.position.setFromSpherical(sphericalHelperMushrooms2);

  const rollingGroundVector = rollingGroundSphere.position.clone().normalize();
  const mushroomVector = newMushroom2.mesh.position.clone().normalize();
  newMushroom2.mesh.quaternion.setFromUnitVectors(mushroomVector, rollingGroundVector);
  newMushroom2.mesh.rotation.x += (Math.random() * (2 * Math.PI / 20)) + - Math.PI / 20;

  rollingGroundSphere.add(newMushroom2.mesh);
};

const addMushroom3 = (inPath, row, isLeft) => {
  let newMushroom3;
  if (inPath) {
    if (mushroomPool3.length === 0) return;
    newMushroom3 = mushroomPool3.pop();
    newMushroom3.visible = true;
    mushroomsInPath3.push(newMushroom3);
    sphericalHelperMushrooms3.set(worldRadius - .3, pathAngleValuesMushrooms3[row], - rollingGroundSphere.x + 10);
  } else {
    newMushroom3 = createMushroom3();
    let forestAreaAngle = 0;

    if (isLeft) {
      forestAreaAngle = 1.68 + Math.random() * 0.5;
    } else {
      forestAreaAngle = 1.46 - Math.random() * 0.4;
    }
    sphericalHelperMushrooms3.set(worldRadius - 0.3, forestAreaAngle, row);
  }
  newMushroom3.mesh.position.setFromSpherical(sphericalHelperMushrooms3);

  const rollingGroundVector = rollingGroundSphere.position.clone().normalize();
  const mushroomVector = newMushroom3.mesh.position.clone().normalize();
  newMushroom3.mesh.quaternion.setFromUnitVectors(mushroomVector, rollingGroundVector);
  newMushroom3.mesh.rotation.x += (Math.random() * (2 * Math.PI / 20)) + - Math.PI / 20;

  rollingGroundSphere.add(newMushroom3.mesh);
};

const addRups = (inPath, row, isLeft) => {
  let newRups;
  if (inPath) {
    if (rupsPool.length === 0) return;
    newRups = rupsPool.pop();
    newRups.visible = true;
    rupsInPath.push(newRups);
    sphericalHelperRups.set(worldRadius - .3, pathAngleValuesRups[row], - rollingGroundSphere.x + 10);
  } else {
    newRups = createRups();
    let forestAreaAngle = 0;

    if (isLeft) {
      forestAreaAngle = 1.68 + Math.random() * 0.5;
    } else {
      forestAreaAngle = 1.46 - Math.random() * 0.4;
    }
    sphericalHelperRups.set(worldRadius - 0.3, forestAreaAngle, row);
  }
  newRups.mesh.position.setFromSpherical(sphericalHelperRups);

  const rollingGroundVector = rollingGroundSphere.position.clone().normalize();
  const rupsVector = newRups.mesh.position.clone().normalize();
  newRups.mesh.quaternion.setFromUnitVectors(rupsVector, rollingGroundVector);
  newRups.mesh.rotation.x += (Math.random() * (2 * Math.PI / 20)) + - Math.PI / 20;

  rollingGroundSphere.add(newRups.mesh);
};

const addTak = (inPath, row, isLeft) => {
  let newTak;
  if (inPath) {
    if (takPool.length === 0) return;
    newTak = takPool.pop();
    newTak.visible = true;
    takInPath.push(newTak);
    sphericalHelperTak.set(worldRadius - .3, pathAngleValuesTak[row], - rollingGroundSphere.x + 10);
  } else {
    newTak = createTak();
    let forestAreaAngle = 0;

    if (isLeft) {
      forestAreaAngle = 1.68 + Math.random() * 0.5;
    } else {
      forestAreaAngle = 1.46 - Math.random() * 0.4;
    }
    sphericalHelperTak.set(worldRadius - 0.3, forestAreaAngle, row);
  }
  newTak.mesh.position.setFromSpherical(sphericalHelperTak);

  const rollingGroundVector = rollingGroundSphere.position.clone().normalize();
  const takVector = newTak.mesh.position.clone().normalize();
  newTak.mesh.quaternion.setFromUnitVectors(takVector, rollingGroundVector);
  // newTak.mesh.rotation.x += (Math.random() * (2 * Math.PI / 20)) + - Math.PI / 20;

  rollingGroundSphere.add(newTak.mesh);
};

const addTak2 = (inPath, row, isLeft) => {
  let newTak2;
  if (inPath) {
    if (takPool2.length === 0) return;
    newTak2 = takPool2.pop();
    newTak2.visible = true;
    takInPath2.push(newTak2);
    sphericalHelperTak2.set(worldRadius - .3, pathAngleValuesTak2[row], - rollingGroundSphere.x + 10);
  } else {
    newTak2 = createTak2();
    let forestAreaAngle = 0;

    if (isLeft) {
      forestAreaAngle = 1.68 + Math.random() * 0.5;
    } else {
      forestAreaAngle = 1.46 - Math.random() * 0.4;
    }
    sphericalHelperTak2.set(worldRadius - 0.3, forestAreaAngle, row);
  }
  newTak2.mesh.position.setFromSpherical(sphericalHelperTak2);

  const rollingGroundVector = rollingGroundSphere.position.clone().normalize();
  const takVector = newTak2.mesh.position.clone().normalize();
  newTak2.mesh.quaternion.setFromUnitVectors(takVector, rollingGroundVector);
  // newTak2.mesh.rotation.x += (Math.random() * (2 * Math.PI / 20)) + - Math.PI / 20;

  rollingGroundSphere.add(newTak2.mesh);
};

const addTak3 = (inPath, row, isLeft) => {
  let newTak3;
  if (inPath) {
    if (takPool3.length === 0) return;
    newTak3 = takPool3.pop();
    newTak3.visible = true;
    takInPath3.push(newTak3);
    sphericalHelperTak3.set(worldRadius - .3, pathAngleValuesTak3[row], - rollingGroundSphere.x + 10);
  } else {
    newTak3 = createTak3();
    let forestAreaAngle = 0;

    if (isLeft) {
      forestAreaAngle = 1.68 + Math.random() * 0.5;
    } else {
      forestAreaAngle = 1.46 - Math.random() * 0.4;
    }
    sphericalHelperTak3.set(worldRadius - 0.3, forestAreaAngle, row);
  }
  newTak3.mesh.position.setFromSpherical(sphericalHelperTak3);

  const rollingGroundVector = rollingGroundSphere.position.clone().normalize();
  const takVector = newTak3.mesh.position.clone().normalize();
  newTak3.mesh.quaternion.setFromUnitVectors(takVector, rollingGroundVector);
  // newTak3.mesh.rotation.x += (Math.random() * (2 * Math.PI / 20)) + - Math.PI / 20;

  rollingGroundSphere.add(newTak3.mesh);
};

const addTak4 = (inPath, row, isLeft) => {
  let newTak4;
  if (inPath) {
    if (takPool4.length === 0) return;
    newTak4 = takPool4.pop();
    newTak4.visible = true;
    takInPath4.push(newTak4);
    sphericalHelperTak4.set(worldRadius - .3, pathAngleValuesTak4[row], - rollingGroundSphere.x + 10);
  } else {
    newTak4 = createTak4();
    let forestAreaAngle = 0;

    if (isLeft) {
      forestAreaAngle = 1.68 + Math.random() * 0.5;
    } else {
      forestAreaAngle = 1.46 - Math.random() * 0.4;
    }
    sphericalHelperTak4.set(worldRadius - 0.3, forestAreaAngle, row);
  }
  newTak4.mesh.position.setFromSpherical(sphericalHelperTak4);

  const rollingGroundVector = rollingGroundSphere.position.clone().normalize();
  const takVector = newTak4.mesh.position.clone().normalize();
  newTak4.mesh.quaternion.setFromUnitVectors(takVector, rollingGroundVector);
  // newTak4.mesh.rotation.x += (Math.random() * (2 * Math.PI / 20)) + - Math.PI / 20;

  rollingGroundSphere.add(newTak4.mesh);
};

const addTak5 = (inPath, row, isLeft) => {
  let newTak5;
  if (inPath) {
    if (takPool5.length === 0) return;
    newTak5 = takPool5.pop();
    newTak5.visible = true;
    takInPath5.push(newTak5);
    sphericalHelperTak5.set(worldRadius - .3, pathAngleValuesTak5[row], - rollingGroundSphere.x + 10);
  } else {
    newTak5 = createTak5();
    let forestAreaAngle = 0;

    if (isLeft) {
      forestAreaAngle = 1.68 + Math.random() * 0.5;
    } else {
      forestAreaAngle = 1.46 - Math.random() * 0.4;
    }
    sphericalHelperTak5.set(worldRadius - 0.3, forestAreaAngle, row);
  }
  newTak5.mesh.position.setFromSpherical(sphericalHelperTak5);

  const rollingGroundVector = rollingGroundSphere.position.clone().normalize();
  const takVector = newTak5.mesh.position.clone().normalize();
  newTak5.mesh.quaternion.setFromUnitVectors(takVector, rollingGroundVector);
  newTak5.mesh.rotation.x += (Math.random() * (2 * Math.PI / 20)) + - Math.PI / 20;

  rollingGroundSphere.add(newTak5.mesh);
};



const addApple = (inPath, row, isLeft) => {
  addFruits(inPath, row, isLeft, applesPool, applesInPath, sphericalHelperApples, worldRadius, - .4, Math.random() * 1, fruitPathAngleValues, rollingGroundSphere, createApple, .7, Math.random() * 1.5);
};

const addBanana = (inPath, row, isLeft) => {
  addFruits(inPath, row, isLeft, bananasPool, bananasInPath, sphericalHelperBananas, worldRadius, - .1, Math.random() * 1, fruitPathAngleValues, rollingGroundSphere, createBanana, .3, 0);
};

const addOrange = (inPath, row, isLeft) => {
  addFruits(inPath, row, isLeft, orangesPool, orangesInPath, sphericalHelperOranges, worldRadius, .1, Math.random() * 1, fruitPathAngleValues, rollingGroundSphere, createOrange, .7, Math.random() * 1.5);
};

const addGrapes = (inPath, row, isLeft) => {
  addFruits(inPath, row, isLeft, grapesPool, grapesInPath, sphericalHelperGrapes, worldRadius, - .3, Math.random() * 1, fruitPathAngleValues, rollingGroundSphere, createGrapes, .7, Math.random() * 1.5);
};


const doMushroomLogic = () => {
  let oneMushroom;
  const mushroomPos = new THREE.Vector3();
  const mushroomsToRemove = [];
  mushroomsInPath.forEach(function (element, index) {
    oneMushroom = mushroomsInPath[index];
    mushroomPos.setFromMatrixPosition(oneMushroom.mesh.matrixWorld);
    if (mushroomPos.z > 6 && oneMushroom.visible) {
      mushroomsToRemove.push(oneMushroom);
    } else {
      if (mushroomPos.distanceTo(fly.mesh.position) <= 0) {
        console.log(`hit`);
      }
    }
  });

  let fromWhere;
  mushroomsToRemove.forEach(function (element, index) {
    oneMushroom = mushroomsToRemove[index];
    fromWhere = mushroomsInPath.indexOf(oneMushroom);
    mushroomsInPath.splice(fromWhere, 1);
    mushroomPool.push(oneMushroom);
    oneMushroom.visible = false;
  });
};

const doMushroomLogic2 = () => {
  let oneMushroom2;
  const mushroomPos2 = new THREE.Vector3();
  const mushroomsToRemove2 = [];
  mushroomsInPath2.forEach(function (element, index) {
    oneMushroom2 = mushroomsInPath2[index];
    mushroomPos2.setFromMatrixPosition(oneMushroom2.mesh.matrixWorld);
    if (mushroomPos2.z > 6 && oneMushroom2.visible) {
      mushroomsToRemove2.push(oneMushroom2);
    } else {
      if (mushroomPos2.distanceTo(fly.mesh.position) <= 0) {
        console.log(`hit`);
      }
    }
  });

  let fromWhere;
  mushroomsToRemove2.forEach(function (element, index) {
    oneMushroom2 = mushroomsToRemove2[index];
    fromWhere = mushroomsInPath2.indexOf(oneMushroom2);
    mushroomsInPath2.splice(fromWhere, 1);
    mushroomPool2.push(oneMushroom2);
    oneMushroom2.visible = false;
  });
};

const doMushroomLogic3 = () => {
  let oneMushroom3;
  const mushroomPos3 = new THREE.Vector3();
  const mushroomsToRemove3 = [];
  mushroomsInPath3.forEach(function (element, index) {
    oneMushroom3 = mushroomsInPath3[index];
    mushroomPos3.setFromMatrixPosition(oneMushroom3.mesh.matrixWorld);
    if (mushroomPos3.z > 6 && oneMushroom3.visible) {
      mushroomsToRemove3.push(oneMushroom3);
    } else {
      if (mushroomPos3.distanceTo(fly.mesh.position) <= 0) {
        console.log(`hit`);
      }
    }
  });

  let fromWhere;
  mushroomsToRemove3.forEach(function (element, index) {
    oneMushroom3 = mushroomsToRemove3[index];
    fromWhere = mushroomsInPath3.indexOf(oneMushroom3);
    mushroomsInPath3.splice(fromWhere, 1);
    mushroomPool3.push(oneMushroom3);
    oneMushroom3.visible = false;
  });
};

const doRupsLogic = () => {
  let oneRups;
  const rupsPos = new THREE.Vector3();
  const rupsToRemove = [];
  rupsInPath.forEach(function (element, index) {
    oneRups = rupsInPath[index];
    rupsPos.setFromMatrixPosition(oneRups.mesh.matrixWorld);
    if (rupsPos.z > 6 && oneRups.visible) {
      rupsToRemove.push(oneRups);
    } else {
      if (rupsPos.distanceTo(fly.mesh.position) <= 0) {
        console.log(`hit`);
      }
    }
  });

  let fromWhere;
  rupsToRemove.forEach(function (element, index) {
    oneRups = rupsToRemove[index];
    fromWhere = rupsInPath.indexOf(oneRups);
    rupsInPath.splice(fromWhere, 1);
    rupsInPath.push(oneRups);
    oneRups.visible = false;
  });
};

const doTakLogic = () => {
  let oneTak;
  const takPos = new THREE.Vector3();
  const takToRemove = [];
  takInPath.forEach(function (element, index) {
    oneTak = takInPath[index];
    takPos.setFromMatrixPosition(oneTak.mesh.matrixWorld);
    if (takPos.z > 6 && oneTak.visible) {
      takToRemove.push(oneTak);
    } else {
      if (takPos.distanceTo(fly.mesh.position) <= 0) {
        console.log(`hit`);
      }
    }
  });

  let fromWhere;
  takToRemove.forEach(function (element, index) {
    oneTak = takToRemove[index];
    fromWhere = takInPath.indexOf(oneTak);
    takInPath.splice(fromWhere, 1);
    takInPath.push(oneTak);
    oneTak.visible = false;
  });
};

const doTakLogic2 = () => {
  let oneTak2;
  const takPos2 = new THREE.Vector3();
  const takToRemove2 = [];
  takInPath2.forEach(function (element, index) {
    oneTak2 = takInPath2[index];
    takPos2.setFromMatrixPosition(oneTak2.mesh.matrixWorld);
    if (takPos2.z > 6 && oneTak2.visible) {
      takToRemove2.push(oneTak2);
    } else {
      if (takPos2.distanceTo(fly.mesh.position) <= 0) {
        console.log(`hit`);
      }
    }
  });

  let fromWhere;
  takToRemove2.forEach(function (element, index) {
    oneTak2 = takToRemove2[index];
    fromWhere = takInPath.indexOf(oneTak2);
    takInPath2.splice(fromWhere, 1);
    takInPath2.push(oneTak2);
    oneTak2.visible = false;
  });
};

const doTakLogic3 = () => {
  let oneTak3;
  const takPos3 = new THREE.Vector3();
  const takToRemove3 = [];
  takInPath3.forEach(function (element, index) {
    oneTak3 = takInPath3[index];
    takPos3.setFromMatrixPosition(oneTak3.mesh.matrixWorld);
    if (takPos3.z > 6 && oneTak3.visible) {
      takToRemove3.push(oneTak3);
    } else {
      if (takPos3.distanceTo(fly.mesh.position) <= 0) {
        console.log(`hit`);
      }
    }
  });

  let fromWhere;
  takToRemove3.forEach(function (element, index) {
    oneTak3 = takToRemove3[index];
    fromWhere = takInPath.indexOf(oneTak3);
    takInPath3.splice(fromWhere, 1);
    takInPath3.push(oneTak3);
    oneTak3.visible = false;
  });
};

const doTakLogic4 = () => {
  let oneTak4;
  const takPos4 = new THREE.Vector3();
  const takToRemove4 = [];
  takInPath4.forEach(function (element, index) {
    oneTak4 = takInPath4[index];
    takPos4.setFromMatrixPosition(oneTak4.mesh.matrixWorld);
    if (takPos4.z > 6 && oneTak4.visible) {
      takToRemove4.push(oneTak4);
    } else {
      if (takPos4.distanceTo(fly.mesh.position) <= 0) {
        console.log(`hit`);
      }
    }
  });

  let fromWhere;
  takToRemove4.forEach(function (element, index) {
    oneTak4 = takToRemove4[index];
    fromWhere = takInPath.indexOf(oneTak4);
    takInPath4.splice(fromWhere, 1);
    takInPath4.push(oneTak4);
    oneTak4.visible = false;
  });
};

const doTakLogic5 = () => {
  let oneTak5;
  const takPos5 = new THREE.Vector3();
  const takToRemove5 = [];
  takInPath5.forEach(function (element, index) {
    oneTak5 = takInPath5[index];
    takPos5.setFromMatrixPosition(oneTak5.mesh.matrixWorld);
    if (takPos5.z > 6 && oneTak5.visible) {
      takToRemove5.push(oneTak5);
    } else {
      if (takPos5.distanceTo(fly.mesh.position) <= 0) {
        console.log(`hit`);
      }
    }
  });

  let fromWhere;
  takToRemove5.forEach(function (element, index) {
    oneTak5 = takToRemove5[index];
    fromWhere = takInPath.indexOf(oneTak5);
    takInPath5.splice(fromWhere, 1);
    takInPath5.push(oneTak5);
    oneTak5.visible = false;
  });
};


const music = () => {
  pingPong = new Tone.PingPongDelay(`4n`, 0.2).toMaster();
  volume = new Tone.Volume();
  distortion = new Tone.Distortion();
  polySynth = new Tone.Synth(
    {
      oscillator:
      {
        type: `pwm`,
        modulationType: `fat`,
        modulationIndex: .5,
        harmonicity: 20
      },
      envelope: {
        attack: 0.001,
        decay: 0.1,
        sustain: 0.1,
        release: 1.4
      }
    }
  ).connect(pingPong).chain(volume, distortion, Tone.Master);
};


const playMusic = (object, toon) => {
  pingPong.delayTime.value = fly.mesh.position.y / 10 * 3;
  volume.volume.value = object.mesh.scale.x * 500;
  distortion.distortion = 1 + fly.mesh.position.x;
  polySynth.triggerAttackRelease(toon, `8n`);
  const clock = time.getElapsedTime();
  notes.push({time: clock, note: toon, distortion: distortion.distortion, volume: volume.volume.value, pingPong: pingPong.delayTime.value});
};

let currentObject, currentToon;

const doLogic = (objectsInPath, toon) => {
  flyBox = new THREE.Box3().setFromObject(fly.mesh);
  for (let i = 0;i < objectsInPath.length;i ++) {
    const object = objectsInPath[i];
    const objectBox = new THREE.Box3().setFromObject(object.mesh);
    const collision = flyBox.intersectsBox(objectBox);
    if (collision) {
      collisionObject = true;
      currentObject = object;
      currentToon = toon;
    }
  }
};

const addPathApple = () => {
  addPath(addApple);
};

const addPathBanana = () => {
  addPath(addBanana);
};

const addPathOrange = () => {
  addPath(addOrange);
};

const addPathGrapes = () => {
  addPath(addGrapes);
};

const addPathMushrooms = () => {
  addPath(addMushroom);
};

const addPathMushrooms2 = () => {
  addPath(addMushroom2);
};

const addPathMushrooms3 = () => {
  addPath(addMushroom3);
};

const addPathRups = () => {
  addPath(addRups);
};

const addPathTak = () => {
  addPath(addTak);
};

const addPathTak2 = () => {
  addPath(addTak2);
};

const addPathTak3 = () => {
  addPath(addTak3);
};

const addPathTak4 = () => {
  addPath(addTak4);
};

const addPathTak5 = () => {
  addPath(addTak5);
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
};

const handleMouseMove = e => {
  const tx = - 1 + (e.clientX / sceneWidth) * 2;
  const ty  = 1 - (e.clientY / sceneHeight) * 2;
  mousePos = {x: tx, y: ty};
};

const handleStartClicked = () => {
  time.start();
  document.querySelector(`.counter`).innerHTML = game.counter;
  game.status = `playing`;
  hidePlay();
  startInterval = setInterval(updateCounter, 1000);
};

const handleReplayClicked = () => {
  resetGame();
  time.start();
  document.querySelector(`.counter`).innerHTML = game.counter;
  game.status = `playing`;
  startInterval = setInterval(updateCounter, 1000);
};

const handlePlaySong = () => {
  Tone.Transport.bpm.rampTo(180, 10);
  Tone.Transport.start();
  new Tone.Part((time, value) => {
    distortion.distortion = value.distortion;
    volume.volume.value = value.volume;
    pingPong.delayTime.value = value.pingPong;
    polySynth.triggerAttackRelease(value.note, `8n`, time);
  }, notes).start();
};

const endGame = () => {
  document.querySelector(`.counter`).innerHTML = ``;
  hidePlay();
  game.music = `music`;
  game.fov = `zoom`;
  game.rolling = `reverse`;
  game.fly = `not flying`;
};

const updateCounter = () => {
  if (game.counter > 0) {
    game.counter --;
    document.querySelector(`.counter`).innerHTML = game.counter;
    //hideReplay();
  } else if (game.counter === 0) {
    time.stop();
    endGame();
  }
};

const hidePlay = () => {
  document.querySelector(`.start-game`).style.display = `none`;
  playMessage.style.display = `none`;
};

const showReplay = () => {
  document.querySelector(`.end-game`).style.display = `block`;
  document.getElementById(`replay`).style.display = `block`;
};

const hideReplay = () => {
  document.querySelector(`.end-game`).style.display = `none`;
};

const update = () => {

  if (collisionObject && !lastCollObject) {
    playMusic(currentObject, currentToon);
  }

  lastCollObject = collisionObject;
  collisionObject = false;

  if (game.status === `playing`) {

    if (game.rolling === `normal`) {
  //wereld animeren
      rollingGroundSphere.rotation.x += rollingSpeed;
    } else {
      rollingGroundSphere.rotation.x -= rollingSpeed;
    }

  //logica tijd/clock / releaseinterval
    if (clock.getElapsedTime() > .3) {
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
      // addPathMushrooms();
      // addPathMushrooms2();
      // addPathMushrooms3();
      // addPathRups();
      // addPathTak();
      // addPathTak2();
      // addPathTak3();
      // addPathTak4();
      // addPathTak5();
      clock.start();
    }

    if (mushclock.getElapsedTime() > .5) {
      addPathMushrooms();
      addPathMushrooms2();
      addPathMushrooms3();
      addPathRups();
      addPathTak();
      addPathTak2();
      addPathTak3();
      addPathTak4();
      addPathTak5();
      mushclock.start();
    }

  //bomen en fruit
    doMushroomLogic();
    doMushroomLogic2();
    doMushroomLogic3();
    doRupsLogic();
    doTakLogic();
    doTakLogic2();
    doTakLogic3();
    doTakLogic4();
    doTakLogic5();
    doLogic(applesInPath, toonApple);
    doLogic(grapesInPath, toonGrapes);
    doLogic(orangesInPath, toonOrange);
    doLogic(bananasInPath, toonBanana);


    if (game.fly === `flying`) {
      updateFly();
    }
  }
  //uitzoomen wereld
  if (game.fov === `zoom` && camera.fov <= 100) {
    camera.fov += .8;
    camera.position.y += .02;
    camera.updateProjectionMatrix();
    if (camera.fov === 100.79999999999978) {
      console.log(`volledig uitgezoomd`);
      fly.mesh.position.set(0, 0, 0);
      showReplay();
    }
  }
  //console.log(camera.fov);

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
