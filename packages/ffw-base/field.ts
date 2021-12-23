import Form from './form';

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
    form: Form;
  }) {
    this.name = name;
    this.value = value;
    this.touched = touched;
    this.error = error;
    this.form = form;
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

      if (this.error !== '') {
        this.setError('');
      }
      return true;
    } catch (error) {
      this.setError(error.errors[0]);
      return false;
    }
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return listener;
  }

  unsubscribe(listener) {
    this.listeners = this.listeners.filter(
      (compareListener) => listener !== compareListener
    );
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

  triggerListeners() {
    this.form.batch(() => {
      this.listeners.forEach((listener) => listener(this));
    });
  }
}

export default Field;
