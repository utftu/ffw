import {Field} from 'ffw';
import createStore from '../create-store/create-store.js';

function makeFieldStore(name, field) {
  return createStore(
    () => field.data[name],
    (cb) => field.on(name, cb)
  );
}

class FieldSolid extends Field {
  constructor(config) {
    super(config);
    const field = this;

    this.solid = {
      createStore: (name) => makeFieldStore(name, field),
      field: createStore(
        () => field,
        (cb) => field.on('*', cb)
      ),
      value: makeFieldStore('value', field),
      touched: makeFieldStore('touched', field),
      error: makeFieldStore('error', field),
      errorTouched: makeFieldStore('errorTouched', field),
    };
    this.s = this.solid;
  }
  getInput = () => {
    return {
      value: this.value,
      onChange: this.onChange,
      onBlur: this.onBlur,
    };
  };

  getSelect = () => {
    return {
      value: this.value,
      onChange: (value) =>
        this.onChange({
          target: {
            value,
          },
        }),
      onBlur: this.onBlur,
    };
  };
}

export default FieldSolid;
