function getType(data) {
  if (!data) {
    return 'unknown';
  }
  if (Array.isArray(data)) {
    return 'array';
  }
  if (data.__proto__ === Object.prototype) {
    return 'object';
  }
}

function iterate(structure, type, cb) {
  if (type === 'array') {
    for (let i = 0; i < structure.length; i++) {
      const elem = structure[i];
      cb(elem, i);
    }
    return;
  }
  if (type === 'object') {
    for (let key in structure) {
      cb(structure[key], key);
    }
    return;
  }
}

const createStructure = {
  array: () => [],
  object: () => ({}),
};

function transformStructure(structure, cb, checkTarget) {
  const type = getType(structure);
  if (checkTarget(structure, type)) {
    return cb(structure);
  }
  if (type === 'unknown') {
    return structure;
  }

  const newData = createStructure[type]();

  iterate(structure, type, (data, i) => {
    newData[i] = transformStructure(data, cb, checkTarget);
  });

  return newData;
}

export default transformStructure;
