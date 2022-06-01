import {Form, Field} from 'ffw-base';

class SvelteField extends Field {
  svelte = null;
  s = null;
  constructor(...props) {
    // @ts-ignore
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
      value: makeStore('value'),
      error: makeStore('error'),
      touched: makeStore('touched'),
    };
  }
}

function initForm(options = {}) {
  return new Form({
    createField: (form, name) => new SvelteField({name, form}),
    ...options,
  });
}

export default initForm;
