import FormSvelte from './form-svelte.js';
import FieldSvelte from './field-svelte.js';

function initForm(options = {}) {
  return new FormSvelte({
    createField: (form, name) => new FieldSvelte({name, form}),
    ...options,
  });
}

export default initForm;
