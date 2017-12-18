import * as THREE from 'three';
import * as Tone from 'tone';

//objects
import Fly from './objects/Fly';
import Apple from './objects/Apple';
import Banana from './objects/Banana';
import Orange from './objects/Orange';
import Grapes from './objects/Grapes';

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

//bomen
let treesPool, treesInPath;
let sphericalHelper, pathAngleValues;
let vertexIndex, vertexVector, midPointVector, offset;

//fruits
let fruitPathAngleValues;
let applesPool, applesInPath, bananasPool, bananasInPath, orangesPool, orangesInPath, grapesPool, grapesInPath;
let sphericalHelperApples, sphericalHelperBananas, sphericalHelperOranges, sphericalHelperGrapes;

let clock, clockMusic, time;

//music
let polySynth, distortion, volume, pingPong;
let totalMusic;
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
    counter: 20,
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

  totalMusic = [];

  //bomen
  treesInPath = [];
  treesPool = [];
  sphericalHelper = new THREE.Spherical();
  //angle values for each path on the sphere
  pathAngleValues = [1.51, 1.64];

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
  clockMusic = new THREE.Clock();

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
  createPool(createTree, treesPool);
  createPool(createApple, applesPool);
  createPool(createBanana, bananasPool);
  createPool(createOrange, orangesPool);
  createPool(createGrapes, grapesPool);
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
  addWorldObjects(10, 1, 1, addTree);
  addWorldObjects(20, 8, 3, addApple);
  addWorldObjects(5, 6, 3, addBanana);
  addWorldObjects(5, 4, 3, addOrange);
  addWorldObjects(5, 4, 3, addGrapes);
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
        release: 0.8
      }
    }
  ).connect(pingPong).chain(volume, distortion, Tone.Master);
};


const playMusic = (object, toon) => {
  pingPong.delayTime.value = fly.mesh.position.y / 10 * .5;
  volume.volume.value = object.mesh.scale.x * 500;
  distortion.distortion = 1 + fly.mesh.position.x;
  polySynth.triggerAttackRelease(toon, `4n`);
  //const clock = (Math.round(time.getElapsedTime() * 10) / 10);
  const clock = Math.round((time.getElapsedTime() - 4) * 10) / 10;
  const currentDistortion = distortion.distortion;
  const currentVolume = volume.volume.value;
  const currentPingPong = pingPong.delayTime.value;
  const detail = {toon, clock, currentDistortion, currentVolume, currentPingPong};
  totalMusic.push(detail);
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

const handlePlaySong = () => {
  if (totalMusic.length > 0) {
    clockMusic.start();
    if (game.music === `music`) {
      endMusic();
    }
  }
};

const endMusic = () => {
  const currentTime = (Math.round(clockMusic.getElapsedTime() * 10) / 10);
  totalMusic.forEach((sound, index) => {
    if (currentTime === sound.clock) {
      console.log(sound.clock);
      distortion.distortion = sound.currentDistortion;
      volume.volume.value = sound.currentVolume;
      pingPong.delayTime.value = sound.currentPingPong;
      polySynth.triggerAttackRelease(sound.toon, `8n`);
      totalMusic.splice(index, 1);
    }
  });
  if (totalMusic.length === 0) {
    clockMusic.stop();
    cancelAnimationFrame(endMusic);
  }
  requestAnimationFrame(endMusic);
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
