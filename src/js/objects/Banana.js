import * as THREE from 'three';

export default class Banana {
  constructor() {
    this.mesh = new THREE.Object3D();

    const Colors = {
      yellow: 0xFFE13D,
      brown: 0x615517
    };

    const geomBanana = new THREE.TetrahedronGeometry(5, 1);
    const matBanana = new THREE.MeshPhongMaterial({color: Colors.yellow, flatShading: true});
    const banana = new THREE.Mesh(geomBanana, matBanana);
    banana.castShadow = true;
    banana.recieveShadow = true;
    banana.scale.set(0.5, 1.5, 0.5);
    banana.position.y = 30;
    this.mesh.add(banana);

    const geomSteel = new THREE.BoxGeometry(1, 3, 1, 1, 1, 1);
    const matSteel = new THREE.MeshPhongMaterial({color: Colors.brown, flatShading: true});
    const steel = new THREE.Mesh(geomSteel, matSteel);
    steel.position.set(0, 37, 0);

    steel.castShadow = true;
    steel.recieveShadow = true;
    this.mesh.add(steel);
  }
}
