import createControlledPromise from 'utftu/create-controlled-promise.js';

class DelayedCalls {
  _calls = new Map();

  constructor(batch) {
    this.batch = batch || ((cb) => cb());
  }

  promise = null;
  add(key1, key2, callback) {
    if (!this._calls.has(key1)) {
      this._calls.set(key1, new Map());
    }
    const level1 = this._calls.get(key1);

    level1.set(key2, callback);

    if (!this.promise) {
      const [promise, promiseControls] = createControlledPromise();
      this.promise = promise;
      this.promiseConrtols = promiseControls;
      queueMicrotask(async () => {
        await this._call();
        this._calls.clear();
        this.promiseConrtols.resolve();
        this.promise = null;
      });
    }
    return this.promise;
  }
  _call() {
    return this.batch(() => {
      for (const level1 of this._calls.values()) {
        for (const cb of level1.values()) {
          cb();
        }
      }
    });
  }
}

export default DelayedCalls;
