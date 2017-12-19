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
import Tak from './objects/Tak';

//functions
import addPath from './lib/addPath';
import createPool from './lib/createPool';
import addWorldObjects from './lib/addWorldObjects';
import addFruits from './lib/addFruits';
import addSurroundings from './lib/addSurroundings';
import doObjectLogic from './lib/doObjectLogic';

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
let mushroomPool, mushroomsInPath, sphericalHelperMushrooms, mushroomPool2, mushroomsInPath2, sphericalHelperMushrooms2;
let mushroomPool3, mushroomsInPath3, sphericalHelperMushrooms3;

//Rups en takken
let rupsPool, rupsInPath, sphericalHelperRups, takPool, takInPath, sphericalHelperTak;

//fruits
let pathAngleValues;
let applesPool, applesInPath, bananasPool, bananasInPath, orangesPool, orangesInPath, grapesPool, grapesInPath;
let sphericalHelperApples, sphericalHelperBananas, sphericalHelperOranges, sphericalHelperGrapes;

//time
let clock, time, mushclock;

//music
let polySynth, distortion, volume, pingPong, notes;

//collision
let flyBox;
let collisionObject;
let lastCollObject = collisionObject;

//UI
const playMessage = document.querySelector(`.start-button`);
const playSong = document.querySelector(`.playsong-button`);

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

  //mushrooms2
  mushroomPool2 = [];
  mushroomsInPath2 = [];
  sphericalHelperMushrooms2 = new THREE.Spherical();

  //mushrooms3
  mushroomPool3 = [];
  mushroomsInPath3 = [];
  sphericalHelperMushrooms3 = new THREE.Spherical();

  //rups
  rupsPool = [];
  rupsInPath = [];
  sphericalHelperRups = new THREE.Spherical();

  //takken
  takPool = [];
  takInPath = [];
  sphericalHelperTak = new THREE.Spherical();

  //fruitPathAngleValues
  pathAngleValues = [1.52, 1.53, 1.54, 1.55, 1.56, 1.57, 1.58, 1.59, 1.60, 1.61, 1.62];

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

// extra objecten buiten diegene die worden aangemaak in addWorldObjects voor het begin
const createPools = () => {
  createPool(createApple, applesPool, 60);
  createPool(createBanana, bananasPool, 60);
  createPool(createOrange, orangesPool, 60);
  createPool(createGrapes, grapesPool, 60);
  createPool(createMushroom, mushroomPool, 20);
  createPool(createMushroom2, mushroomPool2, 20);
  createPool(createMushroom3, mushroomPool3, 20);
  createPool(createRups, rupsPool, 10);
  createPool(createTak, takPool, 50);
};

const createMushroom = () => {
  const mushroom = new Mushroom1();
  mushroom.mesh.scale.set(.6, .6, .6);
  return mushroom;
};

const createMushroom2 = () => {
  const mushroom2 = new Mushroom2();
  mushroom2.mesh.scale.set(.3, .3, .3);
  return mushroom2;
};

const createMushroom3 = () => {
  const mushroom3 = new Mushroom3();
  mushroom3.mesh.scale.set(.6, .6, .6);
  return mushroom3;
};

const createRups = () => {
  const rups = new Rups();
  rups.mesh.scale.set(.009, .009, .009);
  return rups;
};

const createTak = () => {
  const tak = new Tak();
  tak.mesh.scale.set(.06, .06, .06);
  return tak;
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
  addWorldObjects(12, 6, 8, addMushroom2);
  addWorldObjects(6, 4, 3, addMushroom3);
  addWorldObjects(5, 5, 4, addRups);
  addWorldObjects(20, 8, 3, addTak);
};

const addMushroom = (inPath, row, isLeft) => {
  addSurroundings(inPath, row, isLeft, mushroomPool, mushroomsInPath, sphericalHelperMushrooms, worldRadius, .3, Math.random() * 1.5, pathAngleValues, rollingGroundSphere, 4, createMushroom, .5, .4, .3, 0);
};

const addMushroom2 = (inPath, row, isLeft) => {
  addSurroundings(inPath, row, isLeft, mushroomPool2, mushroomsInPath2, sphericalHelperMushrooms2, worldRadius, .8, 0, pathAngleValues, rollingGroundSphere, 1, createMushroom2, .2, .6, .3, 0);
};

const addMushroom3 = (inPath, row, isLeft) => {
  addSurroundings(inPath, row, isLeft, mushroomPool3, mushroomsInPath3, sphericalHelperMushrooms3, worldRadius, .8, 0, pathAngleValues, rollingGroundSphere, 4, createMushroom3, .3, .7, .3, 0);
};

const addRups = (inPath, row, isLeft) => {
  addSurroundings(inPath, row, isLeft, rupsPool, rupsInPath, sphericalHelperRups, worldRadius, 0, 0, pathAngleValues, rollingGroundSphere, 4, createRups, .3, .1, .7, 0);
};

const addTak = (inPath, row, isLeft) => {
  addSurroundings(inPath, row, isLeft, takPool, takInPath, sphericalHelperTak, worldRadius, .4, Math.random() * 1.5, pathAngleValues, rollingGroundSphere, 4, createTak, .3, .1, .7, Math.random() * 1.5);
};

const addApple = (inPath, row, isLeft) => {
  addFruits(inPath, row, isLeft, applesPool, applesInPath, sphericalHelperApples, worldRadius, - .4, Math.random() * 1, pathAngleValues, rollingGroundSphere, createApple, .7, Math.random() * 1.5);
};

const addBanana = (inPath, row, isLeft) => {
  addFruits(inPath, row, isLeft, bananasPool, bananasInPath, sphericalHelperBananas, worldRadius, - .1, Math.random() * 1, pathAngleValues, rollingGroundSphere, createBanana, .3, 0);
};

const addOrange = (inPath, row, isLeft) => {
  addFruits(inPath, row, isLeft, orangesPool, orangesInPath, sphericalHelperOranges, worldRadius, .1, Math.random() * 1, pathAngleValues, rollingGroundSphere, createOrange, .7, Math.random() * 1.5);
};

const addGrapes = (inPath, row, isLeft) => {
  addFruits(inPath, row, isLeft, grapesPool, grapesInPath, sphericalHelperGrapes, worldRadius, - .3, Math.random() * 1, pathAngleValues, rollingGroundSphere, createGrapes, .7, Math.random() * 1.5);
};

const doSurroundingLogic = () => {
  doObjectLogic(mushroomsInPath, mushroomPool, fly);
  doObjectLogic(mushroomsInPath2, mushroomPool2, fly);
  doObjectLogic(mushroomsInPath3, mushroomPool3, fly);
  doObjectLogic(rupsInPath, rupsPool, fly);
  doObjectLogic(takInPath, takPool, fly);
};


const music = () => {
  pingPong = new Tone.PingPongDelay(`8n`, 0.1).toMaster();
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
        release: 5
      }
    }
  ).connect(pingPong).chain(volume, distortion, Tone.Master);
};


const playMusic = (object, toon) => {
  pingPong.delayTime.value = fly.mesh.position.y / 20;
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

const addPathSurroundings = () => {
  addPath(addMushroom);
  addPath(addMushroom2);
  addPath(addMushroom3);
  addPath(addRups);
  addPath(addTak);
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

  playSong.classList.toggle(`active`);
  if (playSong.classList.contains(`active`)) {
    playSong.innerHTML = `Pause song`;
    Tone.Transport.start();
  }

  if (!playSong.classList.contains(`active`)) {
    playSong.innerHTML = `Play song`;
    Tone.Transport.pause();
  }

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
      const randomfruit = 1 + Math.floor(Math.random() * 4);
      if (randomfruit === 1 || randomfruit === 4) {
        addPathApple();
      }
      if (randomfruit === 2 || randomfruit === 4) {
        addPathBanana();
      }
      if (randomfruit === 3 || randomfruit === 2) {
        addPathOrange();
      }
      if (randomfruit === 4 || randomfruit === 3) {
        addPathGrapes();
      }
      clock.start();
    }

    addPathSurroundings();
    mushclock.start();

    doSurroundingLogic();
    doLogic(applesInPath, `C${Math.floor(2 + Math.random() * 4)}`);
    doLogic(grapesInPath, `E${Math.floor(2 + Math.random() * 4)}`);
    doLogic(orangesInPath, `D${Math.floor(2 + Math.random() * 4)}`);
    doLogic(bananasInPath, `F${Math.floor(2 + Math.random() * 4)}`);


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
