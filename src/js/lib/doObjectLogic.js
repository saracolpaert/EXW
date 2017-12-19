import * as THREE from 'three';

export default (objectsInPath, objectsPool, fly) => {
  let oneObject;
  const objectPos = new THREE.Vector3();
  const objectsToRemove = [];
  objectsInPath.forEach((element, index) => {
    oneObject = objectsInPath[index];
    objectPos.setFromMatrixPosition(oneObject.mesh.matrixWorld);
    if (objectPos.z > 6 && oneObject.visible) {
      objectsToRemove.push(oneObject);
    } else {
      if (objectPos.distanceTo(fly.mesh.position) <= 0) {
        console.log(`hit`);
      }
    }
  });

  let fromWhere;
  objectsToRemove.forEach((element, index) => {
    oneObject = objectsToRemove[index];
    fromWhere = objectsInPath.indexOf(oneObject);
    objectsInPath.splice(fromWhere, 1);
    objectsPool.push(oneObject);
    oneObject.visible = false;
  });

};
