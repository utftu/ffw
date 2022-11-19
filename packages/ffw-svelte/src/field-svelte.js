import {Field} from 'packages/ffw';

class FieldSvelte extends Field {
  svelte = null;
  s = null;
  constructor(...props) {
    super(...props);

    const field = this;

    function makeStore(name) {
      return {
        set(newData) {
          field.setData(name, newData);
        },
        subscribe(cb) {
          cb(field.data[name]);
          return field.subscribe(name, () => {
            cb(field.data[name]);
          });
        },
      };
    }
    this.makeStore = makeStore;
    this.svelte = this.s = {
      subscribe(cb) {
        cb(field);
        return field.on('*', cb);
      },
      touched: makeStore('touched'),
      error: makeStore('error'),
      value: {
        set(newValue) {
          field.set(newValue);
        },
        subscribe(cb) {
          cb(field.value);
          return field.on('value', () => cb(field.value));
        },
      },
      errorTouched: {
        subscribe: (cb) => {
          cb(field.errorTouched);
          return field.on('errorTouched', () => {
            cb(field.errorTouched);
          });
        },
      },
    };
  }
}

export default FieldSvelte;
