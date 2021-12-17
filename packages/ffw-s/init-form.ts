import {Form, FormProps} from 'ffw-base';

function initForm(options: FormProps = {}): Form {
  return new Form({...options});
}

export default initForm;
