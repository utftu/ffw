import {Form} from 'packages/ffw';

class FormSvelte extends Form {
  constructor(...args) {
    super(...args);

    const form = this;

    this.svelte = this.s = {
      valid: {
        subscribe(cb) {
          cb(form.valid);
          function handle() {
            cb(form.valid);
          }
          form.emitter.on('valid', handle);
          return () => form.emitter.off('valid', handle);
        },
      },
    };
  }
}

export default FormSvelte;
