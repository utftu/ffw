import {Form, Field, FormProps} from 'ffw-base';

interface Svelte {
  subscribe: any;
  value: {
    prev: any;
    subscribe: any;
  };
  error: {
    prev: string;
    subscribe: any;
  };
  touched: {
    prev: boolean;
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
    this.svelte = {
      subscribe(cb) {
        cb(field);
        return field.subscribe(cb);
      },
      value: {
        prev: field.value,
        subscribe(cb) {
          cb(field.value);
          return field.subscribe(() => {
            if (field.value === field.svelte.value.prev) {
              return;
            }
            field.svelte.value.prev = field.value;
            cb(field.value);
          });
        },
      },
      error: {
        prev: field.error,
        subscribe(cb) {
          cb(field.error);
          return field.subscribe(() => {
            if (field.error === field.svelte.error.prev) {
              return;
            }
            field.svelte.error.prev = field.error;
            cb(field.error);
          });
        },
      },
      touched: {
        prev: field.touched,
        subscribe(cb) {
          cb(field.touched);
          return field.subscribe(() => {
            if (field.touched === field.svelte.touched.prev) {
              return;
            }
            field.svelte.touched.prev = field.touched;
            cb(field.touched);
          });
        },
      },
    };
    this.s = this.svelte;
  }
}

function initForm(options: FormProps = {}): Form {
  return new Form({
    createField: (form, name) => new SvelteField({name, form}),
    ...options,
  });
}

export default initForm;
