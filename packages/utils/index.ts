import {unstable_batchedUpdates} from './react-batched-updates';

export async function waitAsync(milliseconds = 0) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

export function batch(cb: () => void) {
  unstable_batchedUpdates(cb);
}
