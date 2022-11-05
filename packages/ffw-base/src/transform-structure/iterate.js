iterate.EXIT = Symbol('exit');

function iterate(structure, type, cb) {
  if (type === 'array') {
    for (let i = 0; i < structure.length; i++) {
      const elem = structure[i];
      const cbResult = cb(elem, i);
      if (cbResult === iterate.EXIT) {
        return iterate.EXIT;
      }
    }
  } else if (type === 'object') {
    for (let key in structure) {
      const cbResult = cb(structure[key], key);
      if (cbResult === iterate.EXIT) {
        return iterate.EXIT;
      }
    }
  }
}

export default iterate;
