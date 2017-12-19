import * as THREE from 'three';

export default class Tak3 {
  constructor() {
    this.mesh = new THREE.Object3D();

    const geometry1 = new THREE.BoxGeometry(3, 60, 3, 1, 1, 1);
    const material1 = new THREE.MeshPhongMaterial({color: 0x615517, flatShading: true});
    const shape1 = new THREE.Mesh(geometry1, material1);
    shape1.position.set(0, 0, 0);
    this.mesh.add(shape1);

    const geometry2 = new THREE.BoxGeometry(3, 3, 20, 1, 1, 1);
    const material2 = new THREE.MeshPhongMaterial({color: 0x615517, flatShading: true});
    const shape2 = new THREE.Mesh(geometry2, material2);
    shape2.position.set(0, 30, 7);
    shape2.rotation.x -= Math.PI / 4;
    this.mesh.add(shape2);

    const geometry3 = new THREE.BoxGeometry(3, 10, 3, 1, 1, 1);
    const material3 = new THREE.MeshPhongMaterial({color: 0x615517, flatShading: true});
    const shape3 = new THREE.Mesh(geometry3, material3);
    shape3.position.set(0, 41, 14);
    this.mesh.add(shape3);

    const geometry4 = new THREE.BoxGeometry(3, 3, 20, 1, 1, 1);
    const material4 = new THREE.MeshPhongMaterial({color: 0x615517, flatShading: true});
    const shape4 = new THREE.Mesh(geometry4, material4);
    shape4.position.set(0, 0, - 5);
    shape4.rotation.x = Math.PI / 3;
    this.mesh.add(shape4);

    this.mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
  }
}
