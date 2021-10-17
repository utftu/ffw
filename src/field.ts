// export {unstable_batchedUpdates} from 'react-dom';
import Form from './form';

export type Listener = (field: Field) => void;

class Field {
  value: any = '';
  touched: boolean = false;
  error = '';
  name = '';
  getForm: () => Form = null;
  listeners: Listener[] = [];

  constructor({
    name,
    value = '',
    touched = false,
    error = '',
    getForm,
  }: {
    name: string;
    value: any;
    touched?: boolean;
    error?: string;
    getForm: () => Form;
  }) {
    this.getForm = getForm;
    this.name = name;
    this.value = value;
    this.touched = touched;
    this.error = error;
  }

  setError(error: string) {
    this.error = error;
    this.triggerListeners();
  }

  setTouched(touched: boolean) {
    this.touched = touched;
    this.triggerListeners();
  }

  set(value: any) {
    this.value = value;
    this.triggerListeners();
  }

  async validate() {
    const fieldSchema = this.getForm().validateSchema.fields[this.name];
    if (!fieldSchema) {
      return;
    }
    try {
      await fieldSchema.validate(this.value);
    } catch (error) {
      this.setError(error.errors[0]);
    }
  }

  onChange = (event: {target: {value: string}}) => {
    this.set(event.target.value);

    if (this.getForm().options.validateOnChange) {
      this.validate();
    }
  };

  onBlur = () => {
    this.setTouched(true);

    if (this.getForm().options.validateOnBlur) {
      this.validate();
    }
  };

  getInputField = () => {
    return {
      value: this.value,
      name: this.name,
      onChange: this.onChange,
      onBlur: this.onBlur,
    };
  };

  getSelectField = () => {
    return {
      value: this.value,
      name: this.name,
      onChange: (value) => {
        this.value = value;
        this.touched = true;
        this.triggerListeners();

        if (
          this.getForm().options.validateOnChange ||
          this.getForm().options.validateOnBlur
        ) {
          this.validate();
        }
      },
      onBlur: this.onBlur,
    };
  };

  triggerListeners() {
    this.listeners.forEach((listener) => listener(this));
    // unstable_batchedUpdates(() => {
    //   this.listeners.forEach((listener) => listener(this));
    // })
  }
}

export default Field;
