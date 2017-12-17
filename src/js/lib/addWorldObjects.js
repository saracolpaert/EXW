export default (nObjects, gap1, gap2, addFruit) => {
  const numObjects = nObjects;
  const gap = gap1 / gap2;
  for (let i = 0;i < numObjects;i ++) {
    addFruit(false, i * gap, true);
    addFruit(false, i * gap, false);
  }
};
