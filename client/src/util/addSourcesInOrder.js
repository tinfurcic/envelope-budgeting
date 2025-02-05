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

/* // OLD
export const addSourcesInOrder = (sourcesArray, newSource) => {
  const updatedArr = [...sourcesArray];

  if (newSource.type === "shortTermSavings") {
    updatedArr.unshift(newSource);
  } else if (newSource.type === "longTermSavings") {
    const shortTermSavings = updatedArr.find(obj => obj.type === "shortTermSavings");
    if (!shortTermSavings) {
      updatedArr.unshift(newSource);
    } else {
      updatedArr.splice(1, 0, newSource);
    }
  } else if (newSource.type === "envelope") {
    const index = updatedArr.findIndex((obj) => obj.type ==="envelope" && obj.order > newSource.order);
    
    if (index === -1) {
      updatedArr.push(newSource);
    } else {
      updatedArr.splice(index, 0, newSource);
    }
  }

  return updatedArr;
};
*/