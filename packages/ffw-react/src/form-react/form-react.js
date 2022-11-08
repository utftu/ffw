import {Form} from 'ffw';
import FieldReact from '../field-react/field-react.js';

class FormReact extends Form {
  createField(form, props) {
    return new FieldReact({form, ...props});
  }
}

export default FormReact;
