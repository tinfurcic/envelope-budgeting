export const addSourcesInOrder = (sourcesArray, newSource) => {
  const updatedArr = [...sourcesArray];

  if (newSource.hasOwnProperty('shortTermSavings')) {
    updatedArr.unshift(newSource);
  } else if (newSource.hasOwnProperty('longTermSavings')) {
    const shortTermSavings = updatedArr.find(obj => obj.hasOwnProperty('shortTermSavings'));
    if (!shortTermSavings) {
      updatedArr.unshift(newSource);
    } else {
      updatedArr.splice(1, 0, newSource);
    }
  } else if (newSource.hasOwnProperty('order')) {
    const index = updatedArr.findIndex((obj) => obj.hasOwnProperty('order') && obj.order > newSource.order);
    
    if (index === -1) {
      updatedArr.push(newSource);
    } else {
      updatedArr.splice(index, 0, newSource);
    }
  }

  return updatedArr;
};
