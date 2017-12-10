import * as THREE from 'three';

export default class Grapes {
  constructor() {
    this.mesh = new THREE.Object3D();

    const Colors = {
      purple: 0x9827FF,
      brown: 0x615517
    };

    const geomGrapes = new THREE.TetrahedronGeometry(2, 2);
    const matGrapes = new THREE.MeshPhongMaterial({color: Colors.purple, flatShading: true});
    const grape1 = new THREE.Mesh(geomGrapes, matGrapes);
    grape1.castShadow = true;
    grape1.recieveShadow = true;
    grape1.position.y = 25;
    this.mesh.add(grape1);

    const grape2 = new THREE.Mesh(geomGrapes, matGrapes);
    grape2.castShadow = true;
    grape2.position.set(2, 27, 0);
    grape2.recieveShadow = true;
    this.mesh.add(grape2);

    const grape3 = new THREE.Mesh(geomGrapes, matGrapes);
    grape3.castShadow = true;
    grape3.position.set(2, 29, 2);
    grape3.recieveShadow = true;
    this.mesh.add(grape3);

    const grape4 = new THREE.Mesh(geomGrapes, matGrapes);
    grape4.castShadow = true;
    grape4.position.set(4, 29, 2);
    grape4.recieveShadow = true;
    this.mesh.add(grape4);

    const grape5 = new THREE.Mesh(geomGrapes, matGrapes);
    grape5.castShadow = true;
    grape5.position.set(4, 29, 4);
    grape5.recieveShadow = true;
    this.mesh.add(grape5);

    const grape6 = new THREE.Mesh(geomGrapes, matGrapes);
    grape6.castShadow = true;
    grape6.position.set(4, 27, 4);
    grape6.recieveShadow = true;
    this.mesh.add(grape6);

    const grape7 = new THREE.Mesh(geomGrapes, matGrapes);
    grape7.castShadow = true;
    grape7.position.set(0, 27, 0);
    grape7.recieveShadow = true;
    this.mesh.add(grape7);

    const grape8 = new THREE.Mesh(geomGrapes, matGrapes);
    grape8.castShadow = true;
    grape8.position.set(2, 25, 2);
    grape8.recieveShadow = true;
    this.mesh.add(grape8);

    const grape9 = new THREE.Mesh(geomGrapes, matGrapes);
    grape9.castShadow = true;
    grape9.position.set(2, 25, 4);
    grape9.recieveShadow = true;
    this.mesh.add(grape9);

    const geomSteel = new THREE.BoxGeometry(1, 3, 1, 1, 1, 1);
    const matSteel = new THREE.MeshPhongMaterial({color: Colors.brown, flatShading: true});
    const steel = new THREE.Mesh(geomSteel, matSteel);
    steel.position.set(0, 30, 0);

    steel.castShadow = true;
    steel.recieveShadow = true;
    this.mesh.add(steel);
  }
}
