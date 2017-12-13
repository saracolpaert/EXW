export default (createObject, pool) => {
  const maxInPool = 10;
  let newObject;
  for (let i = 0;i < maxInPool;i ++) {
    newObject = createObject();
    pool.push(newObject);
  }
};
