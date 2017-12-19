import * as THREE from 'three';

export default class Mushroom3 {
  constructor() {
    this.mesh = new THREE.Object3D();

    const geometry = new THREE.SphereGeometry(5, 1, 100, Math.PI, Math.PI, 3 * Math.PI / 2);
    const material = new THREE.MeshPhongMaterial({color: 0xF2E85C, flatShading: true});
    const head = new THREE.Mesh(geometry, material);
    head.material.side = THREE.DoubleSide;
    head.position.set(0, 7, 0);
    this.mesh.add(head);



    const geometryB = new THREE.CylinderGeometry(.5, 2, 10, 16);
    const materialB = new THREE.MeshPhongMaterial({color: 0xeef2e1, flatShading: true});
    const cylinder = new THREE.Mesh(geometryB, materialB);
    cylinder.position.set(0, 5, 0);
    this.mesh.add(cylinder);

  }
}
