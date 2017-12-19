export default (inPath, row, isLeft, surroundingPool, surroundingInPath, sphericalHelperSurrounding, worldRadius, min, mathrndm, pathAngleValuesSurrounding, rollingGroundSphere, plus, createSurrounding, angle1, angle2, min2, mathrndm2) => {
  let newSurrounding;
  if (inPath) {
    if (surroundingPool.length === 0) return;
    newSurrounding = surroundingPool.pop();
    newSurrounding.visible = true;
    surroundingInPath.push(newSurrounding);
    sphericalHelperSurrounding.set(worldRadius - min + mathrndm, pathAngleValuesSurrounding[row], - rollingGroundSphere.x + plus);
  } else {
    newSurrounding = createSurrounding();
    let areaAngle = 0;
    if (isLeft) {
      areaAngle = 1.68 + Math.random() * angle1;
    } else {
      areaAngle = 1.46 - Math.random() * angle2;
    }
    sphericalHelperSurrounding.set(worldRadius - min2 + mathrndm2, areaAngle, row);
  }
  newSurrounding.mesh.position.setFromSpherical(sphericalHelperSurrounding);

  const rollingGroundVector = rollingGroundSphere.position.clone().normalize();
  const surroundingVector = newSurrounding.mesh.position.clone().normalize();
  newSurrounding.mesh.quaternion.setFromUnitVectors(surroundingVector, rollingGroundVector);
  rollingGroundSphere.add(newSurrounding.mesh);
};
