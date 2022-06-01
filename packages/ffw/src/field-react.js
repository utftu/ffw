import {Field} from 'ffw-base';

class FieldReact extends Field {
  getInput = () => {
    return {
      value: this.value,
      name: this.name,
      onChange: this.onChange,
      onBlur: this.onBlur,
    };
  };

  getSelect = () => {
    return {
      value: this.value,
      name: this.name,
      onChange: (value) =>
        this.onChange({
          target: {
            value,
          },
        }),
      onBlur: this.onBlur,
    };
  };
}

export default FieldReact;
