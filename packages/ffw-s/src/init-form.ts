import {Form, Field, FormProps} from 'ffw-base';

interface Svelte {
  subscribe: any;
  makeStore: any;
  value: {
    set: any;
    subscribe: any;
  };
  error: {
    set: any;
    subscribe: any;
  };
  touched: {
    set: any;
    subscribe: any;
  };
}

class SvelteField extends Field {
  svelte: Svelte;
  s: Svelte;
  constructor(...props) {
    // @ts-ignore
    super(...props);

    const field = this;

    function makeStore(name): any {
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

function initForm(options: FormProps = {}): Form<SvelteField> {
  return new Form({
    createField: (form, name) => new SvelteField({name, form}),
    ...options,
  });
}

export default initForm;
