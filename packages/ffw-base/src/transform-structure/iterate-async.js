async function iterateAsync(structure, type, cb) {
  if (type === 'array') {
    for (let i = 0; i < structure.length; i++) {
      const elem = structure[i];
      const cbResult = await cb(elem, i);
      if (cbResult === false) {
        return false;
      }
    }
    return;
  }
  if (type === 'object') {
    for (let key in structure) {
      const cbResult = await cb(structure[key], key);
      if (cbResult === false) {
        return false;
      }
    }
    return;
  }
}

export default iterateAsync;
