export async function waitAsync(milliseconds = 0) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

export function createExternalPromise() {
  let resolve;
  let reject;

  const promise = new Promise((resolveLocal, rejectLocal) => {
    resolve = resolveLocal;
    reject = rejectLocal;
  });

  promise.resolve = resolve;
  promise.reject = reject;
  return promise;
}
