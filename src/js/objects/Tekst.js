import * as THREE from 'three';

let geomTekst;
export default class Tekst {
  constructor() {
    this.mesh = new THREE.Object3D();

    const loader = new THREE.FontLoader();

    loader.load(`../../assets/fonts/ObelixPro_Regular.json`, function (font) {
      geomTekst = new THREE.TextGeometry(`Hello three.js!`, {
        font: font,
        size: 80,
        height: 5,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 10,
        bevelSize: 8,
        bevelSegments: 5
      });
    });


    const material = new THREE.MeshPhongMaterial({color: 0xff0000, specular: 0xffffff});
    const tekst = new THREE.Mesh(geomTekst, material);
    tekst.castShadow = true;
    tekst.receiveShadow = true;

    this.mesh.add(tekst);
  }

}
