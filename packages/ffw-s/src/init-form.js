import {Form} from 'ffw-base';
import FieldSvelte from './field-svelte.js';

function initForm(options = {}) {
  return new Form({
    createField: (form, name) => new FieldSvelte({name, form}),
    ...options,
  });
}

export default initForm;
