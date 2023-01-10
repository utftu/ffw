import {Field} from 'ffw';

function createStore(name, field) {
  return {
    set(newValue) {
      field.setData(name, newValue);
    },
    subscribe(cb) {
      cb(field.data[name]);
      return field.on(name, () => {
        cb(field.data[name]);
      });
    },
  };
}

class FieldSvelte extends Field {
  constructor(...props) {
    super(...props);

    const field = this;

    this.svelte = this.s = {
      createStore,
      subscribe(cb) {
        cb(field);
        return field.on('*', cb);
      },
      touched: createStore('touched', field),
      error: createStore('error', field),
      value: {
        ...createStore('value', field),
        set(newValue) {
          field.set(newValue);
        },
      },
      errorTouched: {
        subscribe: createStore('errorTouched', field).subscribe,
      },
    };
  }
}

export default FieldSvelte;
