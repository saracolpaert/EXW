export default addFruit => {
  const options = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const lane = Math.floor(Math.random() * 10);
  addFruit(true, lane);
  options.splice(lane, 1);
};
