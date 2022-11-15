import {Form} from 'ffw';
import FieldReact from '../field-react/field-react.js';

class FormReact extends Form {
  createField(props) {
    return new FieldReact(props);
  }
}

export default FormReact;
