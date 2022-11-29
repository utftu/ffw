import {Field} from 'ffw';

class FieldReact extends Field {
  getInput = () => {
    return {
      value: this.value,
      onInput: this.onChange,
      onBlur: this.onBlur,
    };
  };

  getSelect = () => {
    return {
      value: this.value,
      onChange: (value) => this.getSelect(value),
      onBlur: this.onBlur,
    };
  };
}

export default FieldReact;
