import {createExternalPromise} from './utils.js';

class DelayedCalls {
  constructor(batch) {
    this.batch = batch;
  }
  changes = {};
  promise = null;
  addCall(name, callback) {
    this.changes[name] = callback;
    if (!this.promise) {
      this.promise = createExternalPromise();
      queueMicrotask(async () => {
        this.promise.resolve();
        await this.handleChanges();
        this.changes = {};
        this.promise = null;
      });
    }
    return this.promise;
  }
  handleChanges() {
    return this.batch(() => {
      for (const changeKey in this.changes) {
        const callback = this.changes[changeKey];
        callback();
      }
    });
  }
}

export default DelayedCalls;
