export const isObjectEmpty = (obj) => {
  for (const property in obj) {
    if (Object.hasOwn(obj, property)) {
      return false;
    }
  }
  return true;
};
