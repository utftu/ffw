import {Field} from 'ffw-base';

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
    this.s = this.svelte = {
      makeStore,
      subscribe(cb) {
        cb(field);
        return field.subscribe('*', cb);
      },
      touched: makeStore('touched'),
      error: makeStore('error'),
      value: {
        set(newValue) {
          field.set(newValue);
        },
        subscribe(cb) {
          cb(field.value);
          return field.subscribe('value', () => {
            cb(field.value);
          });
        },
      },
      errorTouched: {
        subscribe: (cb) => {
          cb(field.errorTouched);
          return field.subscribe('errorTouched', (name) => {
            cb(field.errorTouched);
          });
        },
      },
    };
  }
}

export default FieldSvelte;
