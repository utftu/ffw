import Form from './form';
import {batch} from './utils';

export type Listener = (field: Field) => void;

class Field {
  value: any = '';
  touched: boolean = false;
  error = '';
  name = '';
  form: Form = null;
  listeners: Listener[] = [];

  constructor({
    name,
    value = '',
    touched = false,
    error = '',
    form = null,
  }: {
    name: string;
    value?: any;
    touched?: boolean;
    error?: string;
    form?: Form;
  }) {
    this.form = form;
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

  async validate(): Promise<boolean> {
    const fieldSchema = this.form.validateSchema.fields[this.name];
    if (!fieldSchema) {
      return true;
    }
    try {
      await fieldSchema.validate(this.value);
      this.setError('');
      return true;
    } catch (error) {
      this.setError(error.errors[0]);
      return false;
    }
  }

  onChange = (event: {target: {value: string}}) => {
    this.set(event.target.value);

    if (this.form.options.validateOnChange) {
      this.validate();
    }
  };

  onBlur = () => {
    this.setTouched(true);

    if (this.form.options.validateOnBlur) {
      this.validate();
    }
  };

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

  triggerListeners() {
    batch(() => {
      this.listeners.forEach((listener) => listener(this));
    });
  }
}

export default Field;
