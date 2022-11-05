import getType from './get-type.js';
import iterate from './iterate.js';

function find(structure, checkTarget) {
  const type = getType(structure);
  if (checkTarget(structure) === true) {
    return true;
  }
  if (type === 'unknown') {
    return false;
  }

  const iterateResult = iterate(structure, type, (elem) => {
    if (find(elem, checkTarget)) {
      return iterate.EXIT;
    }
  });

  if (iterateResult === iterate.EXIT) {
    return true;
  }
  return false;
}

export default find;
