import {Form} from 'ffw';
import FieldSvelte from './field-svelte.js';

class FormSvelte extends Form {
  createField(config) {
    return new FieldSvelte(config);
  }
  constructor(config) {
    super(config);

    const form = this;

    this.svelte = this.s = {
      subscribe(cb) {
        cb(form);
        return form.on('*', () => cb(form));
      },
      valid: {
        subscribe(cb) {
          cb(form.valid);
          return form.on('valid', () => cb(form.valid));
        },
      },
    };
  }
}

export default FormSvelte;
