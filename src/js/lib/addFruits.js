export default (inPath, row, isLeft, objectsPool, objectsInPath, sphericalHelperObjects, worldRadius, plusWorldRadius, mathRandom, fruitPathAngleValues, rollingGroundSphere, createFruit, minWorldRadius, mathRandom2) => {
  let newObject;
  if (inPath) {
    if (objectsPool.length === 0) return;
    newObject = objectsPool.pop();
    newObject.visible = true;
    objectsInPath.push(newObject);
    sphericalHelperObjects.set(worldRadius + plusWorldRadius + mathRandom, fruitPathAngleValues[row], - rollingGroundSphere.rotation.x + 4);
  } else {
    newObject = createFruit();
    let objectAreaAngle = 0;
    if (isLeft) {
      objectAreaAngle = 1.68 + Math.random() * 0.1;
    } else {
      objectAreaAngle = 1.46 - Math.random() * 0.1;
    }
    sphericalHelperObjects.set(worldRadius - minWorldRadius + mathRandom2, objectAreaAngle, row);
  }
  newObject.mesh.position.setFromSpherical(sphericalHelperObjects);
  const rollingGroundVector = rollingGroundSphere.position.clone().normalize();
  const objectVector = newObject.mesh.position.clone().normalize();
  newObject.mesh.quaternion.setFromUnitVectors(objectVector, rollingGroundVector);
  newObject.mesh.rotation.x += (Math.random() * (2 * Math.PI / 10)) + - Math.PI / 10;
  rollingGroundSphere.add(newObject.mesh);
};
