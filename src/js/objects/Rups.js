import * as THREE from 'three';

export default class Rups {
  constructor() {
    this.mesh = new THREE.Object3D();

    const geometry = new THREE.SphereBufferGeometry(50, 10, 10);
    const material = new THREE.MeshPhongMaterial({color: 0x2ab26c, flatShading: true});
    const head = new THREE.Mesh(geometry, material);
    head.material.side = THREE.DoubleSide;
    head.position.set(0, 130, 0);
    this.mesh.add(head);

    const geometryB = new THREE.SphereBufferGeometry(50, 10, 10);
    const materialB = new THREE.MeshPhongMaterial({color: 0x2ab26c, flatShading: true});
    const b = new THREE.Mesh(geometryB, materialB);
    b.material.side = THREE.DoubleSide;
    b.position.set(0, 100, 75);
    this.mesh.add(b);

    const geometryC = new THREE.SphereBufferGeometry(50, 10, 10);
    const materialC = new THREE.MeshPhongMaterial({color: 0x2ab26c, flatShading: true});
    const c = new THREE.Mesh(geometryC, materialC);
    c.material.side = THREE.DoubleSide;
    c.position.set(0, 100, 150);
    this.mesh.scale.set(.5, .5, .5);
    this.mesh.add(c);

    const geometryD = new THREE.SphereBufferGeometry(50, 10, 10);
    const materialD = new THREE.MeshPhongMaterial({color: 0x2ab26c, flatShading: true});
    const d = new THREE.Mesh(geometryD, materialD);
    d.material.side = THREE.DoubleSide;
    d.position.set(0, 100, 225);
    this.mesh.add(d);

    const geometryE = new THREE.CylinderGeometry(20, 2, 30, 3);
    const materialE = new THREE.MeshPhongMaterial({color: 0xffff00, flatShading: true});
    const cylinder = new THREE.Mesh(geometryE, materialE);
    cylinder.position.set(- 15, 65, 55);
    cylinder.rotation.set(Math.PI / 4, Math.PI / 8, 0);
    this.mesh.add(cylinder);

    const geometryF = new THREE.CylinderGeometry(20, 2, 30, 3);
    const materialF = new THREE.MeshPhongMaterial({color: 0xffff00, flatShading: true});
    const cylinder2 = new THREE.Mesh(geometryF, materialF);
    cylinder2.position.set(15, 65, 55);
    cylinder2.rotation.set(Math.PI / 4, - Math.PI / 8, 0);
    this.mesh.add(cylinder2);

    const geometryG = new THREE.CylinderGeometry(20, 2, 30, 3);
    const materialG = new THREE.MeshPhongMaterial({color: 0xffff00, flatShading: true});
    const g = new THREE.Mesh(geometryG, materialG);
    g.position.set(- 15, 65, 95);
    g.rotation.set(- Math.PI / 4, Math.PI / 8, 0);
    this.mesh.add(g);

    const geometryH = new THREE.CylinderGeometry(20, 2, 30, 3);
    const materialH = new THREE.MeshPhongMaterial({color: 0xffff00, flatShading: true});
    const h = new THREE.Mesh(geometryH, materialH);
    h.position.set(15, 65, 95);
    h.rotation.set(- Math.PI / 4, - Math.PI / 8, 0);
    this.mesh.add(h);

    const geometryI = new THREE.CylinderGeometry(20, 2, 30, 3);
    const materialI = new THREE.MeshPhongMaterial({color: 0xffff00, flatShading: true});
    const I = new THREE.Mesh(geometryI, materialI);
    I.position.set(- 15, 65, 250);
    I.rotation.set(- Math.PI / 4, Math.PI / 8, 0);
    this.mesh.add(I);

    const geometryJ = new THREE.CylinderGeometry(20, 2, 30, 3);
    const materialJ = new THREE.MeshPhongMaterial({color: 0xffff00, flatShading: true});
    const j = new THREE.Mesh(geometryJ, materialJ);
    j.position.set(15, 65, 250);
    j.rotation.set(- Math.PI / 4, - Math.PI / 8, 0);
    this.mesh.add(j);

    const geometryK = new THREE.BoxGeometry(3, 40, 3, 1, 1, 1);
    const materialK = new THREE.MeshPhongMaterial({color: 0xffff00, flatShading: true});
    const k = new THREE.Mesh(geometryK, materialK);
    k.position.set(- 30, 180, - 30);
    k.rotation.z = Math.PI / 8;
    k.rotation.x -= Math.PI / 4;
    this.mesh.add(k);

    const geometryM = new THREE.BoxGeometry(3, 20, 3, 1, 1, 1);
    const materialM = new THREE.MeshPhongMaterial({color: 0xffff00, flatShading: true});
    const m = new THREE.Mesh(geometryM, materialM);
    m.position.set(- 40, 185, - 50);
    m.rotation.z -= Math.PI / 16;
    m.rotation.x = Math.PI / 4;
    this.mesh.add(m);

    const geometryL = new THREE.BoxGeometry(3, 40, 3, 1, 1, 1);
    const materialL = new THREE.MeshPhongMaterial({color: 0xffff00, flatShading: true});
    const l = new THREE.Mesh(geometryL, materialL);
    l.position.set(30, 180, - 30);
    l.rotation.z -= Math.PI / 8;
    l.rotation.x -= Math.PI / 4;
    this.mesh.add(l);

    const geometryN = new THREE.BoxGeometry(3, 20, 3, 1, 1, 1);
    const materialN = new THREE.MeshPhongMaterial({color: 0xffff00, flatShading: true});
    const n = new THREE.Mesh(geometryN, materialN);
    n.position.set(40, 185, - 50);
    n.rotation.z = Math.PI / 16;
    n.rotation.x = Math.PI / 4;
    this.mesh.add(n);

    //this.mesh.scale.set(.5, .5, .5);
  }
}
