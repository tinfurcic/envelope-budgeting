export const addSourcesInOrder = (sourcesArray, newSource) => {
  const updatedArr = [...sourcesArray];
  const index = updatedArr.findIndex((obj) => obj.order > newSource.order);
  if (index === -1) {
    updatedArr.push(newSource);
  } else {
    updatedArr.splice(index, 0, newSource);
  }
  return updatedArr;
};
