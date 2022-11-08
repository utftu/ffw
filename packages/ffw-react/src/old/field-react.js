import {Field} from 'ffw/dist/types/index.js';

class FieldReact extends Field {
  getInput = () => {
    return {
      value: this.value,
      onChange: this.onChange,
      onBlur: this.onBlur,
    };
  };

  getSelect = () => {
    return {
      value: this.value,
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
