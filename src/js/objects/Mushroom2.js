import * as THREE from 'three';

export default class Mushroom2 {
  constructor() {
    this.mesh = new THREE.Object3D();

    const geometry = new THREE.SphereGeometry(5, 1, 100, Math.PI / 1, Math.PI, 3 * Math.PI / 2);
    const material = new THREE.MeshPhongMaterial({color: 0x4988BF, flatShading: true});
    const head = new THREE.Mesh(geometry, material);
    head.material.side = THREE.DoubleSide;
    this.mesh.add(head);

    head.scale.y = 3;
    head.scale.x = 1.5;
    head.position.set(0, 10, 0);

    const geometryB = new THREE.CylinderGeometry(.5, .5, 10, 16);
    const materialB = new THREE.MeshPhongMaterial({color: 0xeef2e1, flatShading: true});
    const cylinder = new THREE.Mesh(geometryB, materialB);
    cylinder.position.set(0, 6, 0);

    this.mesh.add(cylinder);
  }
}
