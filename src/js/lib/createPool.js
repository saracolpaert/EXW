export default (createObject, pool) => {
  const maxInPool = 50;
  let newObject;
  for (let i = 0;i < maxInPool;i ++) {
    newObject = createObject();
    pool.push(newObject);
  }
};
