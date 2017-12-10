import * as THREE from 'three';

export default class Orange {
  constructor() {
    this.mesh = new THREE.Object3D();

    const Colors = {
      orange: 0xFF8427
    };

    const geomOrange = new THREE.TetrahedronGeometry(5, 2);
    const matOrange = new THREE.MeshPhongMaterial({color: Colors.orange, flatShading: true});
    const orange = new THREE.Mesh(geomOrange, matOrange);
    orange.castShadow = true;
    orange.recieveShadow = true;
    orange.position.set(0, 50, 0);

    this.mesh.add(orange);
  }
}
