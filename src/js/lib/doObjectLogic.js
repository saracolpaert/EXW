import * as THREE from 'three';

export default (objectsInPath, tune1, tune2, objectsPool, fly, polySynth, startTime, totalMusic) => {
  let oneObject;
  const objectPos = new THREE.Vector3();
  const objectsToRemove = [];
  objectsInPath.forEach(function (element, index) {
    oneObject = objectsInPath[index];
    objectPos.setFromMatrixPosition(oneObject.mesh.matrixWorld);
    if (objectPos.z > 6 && oneObject.visible) {
      objectsToRemove.push(oneObject);
    } else {
      const firstBB = new THREE.Box3().setFromObject(fly.mesh);
      const secondBB = new THREE.Box3().setFromObject(oneObject.mesh);
      const collision = firstBB.intersectsBox(secondBB);
      if (collision === true) {
        const sound = polySynth.triggerAttackRelease(tune1, tune2);
        const currentTime = new Date().getTime();
        const time = currentTime - startTime;
        const detail = {sound, time};
        totalMusic.push(detail);
      }
    }
  });

  let fromWhere;
  objectsToRemove.forEach(function (element, index) {
    oneObject = objectsToRemove[index];
    fromWhere = objectsInPath.indexOf(oneObject);
    objectsInPath.splice(fromWhere, 1);
    objectsPool.push(oneObject);
    oneObject.visible = false;
  });

};
