import * as THREE from 'three';

export default class Tak4 {
  constructor() {
    this.mesh = new THREE.Object3D();

    const geometry1 = new THREE.BoxGeometry(3, 3, 40, 1, 1, 1);
    const material1 = new THREE.MeshPhongMaterial({color: 0x615517, flatShading: true});
    const shape1 = new THREE.Mesh(geometry1, material1);
    shape1.position.set(0, 0, 0);
    this.mesh.add(shape1);

    const geometry2 = new THREE.BoxGeometry(3, 3, 20, 1, 1, 1);
    const material2 = new THREE.MeshPhongMaterial({color: 0x615517, flatShading: true});
    const shape2 = new THREE.Mesh(geometry2, material2);
    shape2.position.set(0, 7, 7);
    shape2.rotation.x -= Math.PI / 4;
    this.mesh.add(shape2);

    this.mesh.rotation.set(Math.PI, Math.PI, Math.PI / 2);
  }
}
