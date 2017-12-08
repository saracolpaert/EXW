import * as THREE from 'three';

export default class Fly {
  constructor() {
    this.mesh = new THREE.Object3D();

    const Colors = {
      white: new THREE.Color(`rgb(232, 234, 215)`),
      brownDark: new THREE.Color(`rgb(62, 77, 89)`),
      blue: new THREE.Color(`rgb(124, 152, 174)`),
      blueDark: new THREE.Color(`rgb(56, 93, 122)`)

    };
      // Create the body
    const geomBody = new THREE.BoxGeometry(20, 17, 27, 1, 1, 1);

    const matBody = new THREE.MeshPhongMaterial({color: Colors.blue, flatShading: THREE.FlatShading});
    const body = new THREE.Mesh(geomBody, matBody);
    body.castShadow = true;
    body.receiveShadow = true;
    this.mesh.add(body);

      // Create the left Eye
    const geomLeftEye = new THREE.BoxGeometry(7.5, 15, 4, 1, 1, 1);
    const matLeftEye = new THREE.MeshPhongMaterial({color: Colors.blueDark, flatShading: THREE.FlatShading});
    const leftEye = new THREE.Mesh(geomLeftEye, matLeftEye);
    leftEye.position.set(4.5, 0, 15);
    leftEye.castShadow = true;
    leftEye.receiveShadow = true;
    this.mesh.add(leftEye);

    // Create the left Eye
    const geomRightEye = new THREE.BoxGeometry(7.5, 15, 4, 1, 1, 1);
    const matRightEye = new THREE.MeshPhongMaterial({color: Colors.blueDark, flatShading: THREE.FlatShading});
    const rightEye = new THREE.Mesh(geomRightEye, matRightEye);
    rightEye.position.set(- 4.5, 0, 15);
    rightEye.castShadow = true;
    rightEye.receiveShadow = true;
    this.mesh.add(rightEye);

      // Create the left Wing
    const geomLeftWing = new THREE.BoxGeometry(20, 2, 24, 1, 1, 1);
    geomLeftWing.applyMatrix(new THREE.Matrix4().makeTranslation(0, 2, - 16));

    const matLeftWing = new THREE.MeshPhongMaterial({color: Colors.white, flatShading: THREE.FlatShading});
    const leftWing = new THREE.Mesh(geomLeftWing, matLeftWing);
    leftWing.position.set(- 9.5, 6, 7.5);

    geomLeftWing.vertices[1].x -= 5;
    geomLeftWing.vertices[3].x -= 5;

    geomLeftWing.vertices[5].x += 11;
    geomLeftWing.vertices[7].x += 11;
    geomLeftWing.vertices[5].z += 4;
    geomLeftWing.vertices[7].z += 4;


    geomLeftWing.vertices[4].x -= 3;
    geomLeftWing.vertices[6].x -= 3;

    leftWing.castShadow = true;
    leftWing.receiveShadow = true;
    this.mesh.add(leftWing);

      // Create the right Wing
    const geomRightWing = new THREE.BoxGeometry(20, 2, 24, 1, 1, 1);
    geomRightWing.applyMatrix(new THREE.Matrix4().makeTranslation(0, 2, - 16));

    const matRightWing = new THREE.MeshPhongMaterial({color: Colors.white, flatShading: THREE.FlatShading});
    const rightWing = new THREE.Mesh(geomRightWing, matRightWing);
    rightWing.position.set(9.5, 6, 7.5);

    geomRightWing.vertices[0].x -= 11;
    geomRightWing.vertices[2].x -= 11;
    geomRightWing.vertices[0].z += 4;
    geomRightWing.vertices[2].z += 4;

    geomRightWing.vertices[4].x += 5;
    geomRightWing.vertices[6].x += 5;

    geomRightWing.vertices[3].x += 3;
    geomRightWing.vertices[1].x += 3;

    rightWing.castShadow = true;
    rightWing.receiveShadow = true;
    this.mesh.add(rightWing);

      // Create the LegOne
    const geomLeg = new THREE.BoxGeometry(20, 1, 3, 1, 1, 1);
    const matLeg = new THREE.MeshPhongMaterial({color: Colors.brownDark, flatShading: THREE.FlatShading});
    const leftLeg = new THREE.Mesh(geomLeg, matLeg);
    leftLeg.position.set(11, - 5, 8);
    leftLeg.rotation.z -= Math.PI / 3;
    leftLeg.rotation.x -= Math.PI / 13;
    leftLeg.castShadow = true;
    leftLeg.receiveShadow = true;
    this.mesh.add(leftLeg);

      // Create the LegTwo
    const geomLegTwo = new THREE.BoxGeometry(20, 1, 3, 1, 1, 1);
    const matLegTwo = new THREE.MeshPhongMaterial({color: Colors.brownDark, flatShading: THREE.FlatShading});
    const leftLegTwo = new THREE.Mesh(geomLegTwo, matLegTwo);
    leftLegTwo.position.set(11, - 5, 6);
    leftLegTwo.rotation.z -= Math.PI / 3;
    leftLegTwo.rotation.x -= Math.PI / - 14;
    leftLegTwo.castShadow = true;
    leftLegTwo.receiveShadow = true;
    this.mesh.add(leftLegTwo);

      // Create the LegThree
    const geomLegThree = new THREE.BoxGeometry(20, 1, 3, 1, 1, 1);
    const matLegThree = new THREE.MeshPhongMaterial({color: Colors.brownDark, flatShading: THREE.FlatShading});
    const leftLegThree = new THREE.Mesh(geomLegThree, matLegThree);
    leftLegThree.position.set(11, - 4.5, 10);
    leftLegThree.rotation.z -= Math.PI / 3;
    leftLegThree.rotation.x -= Math.PI / 4;
    leftLegThree.castShadow = true;
    leftLegThree.receiveShadow = true;
    this.mesh.add(leftLegThree);

    // Create the RightLegOne
    const geomRightLeg = new THREE.BoxGeometry(20, 1, 3, 1, 1, 1);
    const matRightLeg = new THREE.MeshPhongMaterial({color: Colors.brownDark, flatShading: THREE.FlatShading});
    const rightLeg = new THREE.Mesh(geomRightLeg, matRightLeg);
    rightLeg.position.set(- 11, - 5, 8);
    rightLeg.rotation.z -= Math.PI / - 3;
    rightLeg.rotation.x -= Math.PI / 13;
    rightLeg.castShadow = true;
    rightLeg.receiveShadow = true;
    this.mesh.add(rightLeg);

    // Create the RightLegTwo
    const geomRightLegTwo = new THREE.BoxGeometry(20, 1, 3, 1, 1, 1);
    const matRightLegTwo = new THREE.MeshPhongMaterial({color: Colors.brownDark, flatShading: THREE.FlatShading});
    const rightLegTwo = new THREE.Mesh(geomRightLegTwo, matRightLegTwo);
    rightLegTwo.position.set(- 11, - 5, 6);
    rightLegTwo.rotation.z -= Math.PI / - 3;
    rightLegTwo.rotation.x -= Math.PI / - 14;
    rightLegTwo.castShadow = true;
    rightLegTwo.receiveShadow = true;
    this.mesh.add(rightLegTwo);

      // Create the RightLegThree
    const geomRightLegThree = new THREE.BoxGeometry(20, 1, 3, 1, 1, 1);
    const matRightLegThree = new THREE.MeshPhongMaterial({color: Colors.brownDark, flatShading: THREE.FlatShading});
    const rightLegThree = new THREE.Mesh(geomRightLegThree, matRightLegThree);
    rightLegThree.position.set(- 11, - 4.5, 10);
    rightLegThree.rotation.z -= Math.PI / - 3;
    rightLegThree.rotation.x -= Math.PI / 4;
    rightLegThree.castShadow = true;
    rightLegThree.receiveShadow = true;
    this.mesh.add(rightLegThree);
  }
}
