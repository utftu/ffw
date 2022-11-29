import {Form} from 'ffw';
import {batch} from 'solid-js';
import FieldSolid from '../field-solid/field-solid.js';
import createStore from '../create-store/create-store.js';

class FormSolid extends Form {
  createField(config) {
    return new FieldSolid(config);
  }
  batch = batch;
  constructor(config) {
    super(config);
    const form = this;

    this.solid = this.s = {
      form: createStore(
        () => form,
        (cb) => form.on('*', cb)
      ),
      valid: createStore(
        () => form.valid,
        (cb) => form.on('valid', cb)
      ),
    };
  }
}

export default FormSolid;
