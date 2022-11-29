import FormSvelte from './form-svelte.js';

function initForm(options = {}) {
  return new FormSvelte({
    ...options,
  });
}

export default initForm;
