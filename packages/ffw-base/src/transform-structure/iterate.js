function iterate(structure, type, cb) {
  if (type === 'array') {
    for (let i = 0; i < structure.length; i++) {
      const elem = structure[i];
      const cbResult = cb(elem, i);
      if (cbResult === false) {
        return false;
      }
    }
    return;
  }
  if (type === 'object') {
    for (let key in structure) {
      const cbResult = cb(structure[key], key);
      if (cbResult === false) {
        return false;
      }
    }
    return;
  }
}

export default iterate;
