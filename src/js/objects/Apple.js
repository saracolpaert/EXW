import * as THREE from 'three';

export default class Apple {
  constructor() {
    this.mesh = new THREE.Object3D();

    const Colors = {
      red: 0xFF553A,
      brown: 0x615517,
      green: 0x7AC447
    };

    const geomApple = new THREE.TetrahedronGeometry(5, 2);
    const matApple = new THREE.MeshPhongMaterial({color: Colors.red, shading: THREE.FlatShading});
    const apple = new THREE.Mesh(geomApple, matApple);
    apple.castShadow = true;
    apple.recieveShadow = true;

    this.mesh.add(apple);

    const geomSteel = new THREE.BoxGeometry(1, 3, 1, 1, 1, 1);
    const matSteel = new THREE.MeshPhongMaterial({color: Colors.brown, shading: THREE.FlatShading});
    const steel = new THREE.Mesh(geomSteel, matSteel);
    steel.position.set(0, 5, 0);

    steel.castShadow = true;
    steel.recieveShadow = true;
    this.mesh.add(steel);

    const geomBlad = new THREE.BoxGeometry(4, 3, .1, 1, 1, 1);
    const matBlad = new THREE.MeshPhongMaterial({color: Colors.green, shading: THREE.FlatShading});
    const blad = new THREE.Mesh(geomBlad, matBlad);
    blad.position.set(- 1, 5, 0);
    blad.scale.set(.5, .5, .5);

    blad.castShadow = true;
    blad.recieveShadow = true;
    this.mesh.add(blad);
  }
}
