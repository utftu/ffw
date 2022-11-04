import creators from './creators.js';
import getType from './get-type.js';
import iterate from './iterate.js';

export const NO_OP = {};

transform.PASS = Symbol('pass');
function transform(structure, cb, checkTarget) {
  const type = getType(structure);
  if (checkTarget(structure, type)) {
    return cb(structure);
  }
  if (type === 'unknown') {
    return structure;
  }

  const newData = creators[type]();

  iterate(structure, type, (data, i) => {
    const transformResult = transform(data, cb, checkTarget);
    if (transformResult === NO_OP) {
      return;
    }
    newData[i] = transformResult;
    // newData[i] = transform(data, cb, checkTarget);
  });

  return newData;
}

export default transform;
