import * as THREE from 'three';

export default class Tak5 {
  constructor() {
    this.mesh = new THREE.Object3D();

    const geometry1 = new THREE.BoxGeometry(3, 3, 50, 1, 1, 1);
    const material1 = new THREE.MeshPhongMaterial({color: 0x724319, flatShading: true});
    const shape1 = new THREE.Mesh(geometry1, material1);
    shape1.position.set(0, 0, 0);
    this.mesh.add(shape1);

    this.mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
  }
}
