import {Field} from 'ffw-base';

class FieldReact extends Field {
  getInputProps = () => {
    return {
      value: this.value,
      name: this.name,
      onChange: this.onChange,
      onBlur: this.onBlur,
    };
  };

  getSelectProps = () => {
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
