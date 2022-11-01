import getType from './get-type.js';
import iterateAsync from './iterate-async.js';
import iterate from './iterate.js';

async function findAsync(structure, checkTarget) {
  const type = getType(structure);
  if ((await checkTarget(structure)) === true) {
    return true;
  }
  if (type === 'unknown') {
    return false;
  }

  const iterateResult = await iterateAsync(structure, type, async (elem) => {
    if (await findAsync(elem, checkTarget)) {
      return false;
    }
  });

  if (iterateResult === false) {
    return true;
  }
  return false;
}

export default findAsync;
