export default (createObject, pool, max) => {
  const maxInPool = max;
  let newObject;
  for (let i = 0;i < maxInPool;i ++) {
    newObject = createObject();
    pool.push(newObject);
  }
};
