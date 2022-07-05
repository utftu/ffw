import {Form} from 'ffw-base';

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
          form.emitter.on('ffw.valid', handle);
          return () => form.emitter.off('ffw.valid', handle);
        },
      },
    };
  }
}

export default FormSvelte;
