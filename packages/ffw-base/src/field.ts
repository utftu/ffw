import Form from './form';
import mitt, {Emitter, Handler} from 'mitt';

export type Listener = (field: Field) => void;

class Field {
  name = '';
  form: Form = null;
  emitter: Emitter<any> = null;

  data: Record<string, any> & {
    value: string;
    error: string;
    touched: boolean;
  } = {
    value: '',
    error: '',
    touched: false,
  };

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
    form: any;
  }) {
    this.emitter = mitt();
    this.name = name;
    this.form = form;

    this.data.value = value;
    this.data.touched = touched;
    this.data.error = error;
  }

  get value() {
    return this.data.value;
  }

  set value(newValue) {
    this.data.value = newValue;
  }

  get error() {
    return this.data.error;
  }

  set error(newError) {
    this.data.error = newError;
  }

  get touched() {
    return this.data.touched;
  }

  set touched(newTouched) {
    this.data.touched = newTouched;
  }

  setData(name, newData) {
    if (this.form.options.checkPrevData && this.data[name] === newData) {
      return;
    }
    this.data[name] = newData;

    this.form.batch(() => {
      this.emitter.emit(name, this.data[name]);
    });
  }

  setError(error: string) {
    this.setData('error', error);
  }

  setTouched(touched: boolean) {
    this.setData('touched', touched);
  }

  set(value: any) {
    this.setData('value', value);
  }

  async validate(): Promise<boolean> {
    const fieldSchema = this.form.validateSchema.fields[this.name];
    if (!fieldSchema) {
      return true;
    }
    try {
      await fieldSchema.validate(this.value);

      if (this.data.error !== '') {
        this.setError('');
      }
      return true;
    } catch (error) {
      this.setError(error.errors[0]);
      return false;
    }
  }

  subscribe(name: string, listener: any) {
    this.emitter.on(name, listener);

    return () => this.emitter.off(name, listener);
  }

  unsubscribe(name: string, listener: any) {
    this.emitter.off(name, listener);
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

  protected globalListeners = [];
  protected globalListener = (...args) => {
    this.globalListeners.forEach((listener) => listener(this, ...args));
  };
  addGlobalListener(listener: any) {
    if (this.globalListeners.length === 0) {
      this.emitter.on('*', this.globalListener);
    }
    this.globalListeners.push(listener);
  }
  removeGlobalListener(listener: any) {
    this.globalListeners = this.globalListeners.filter(
      (globalListener) => globalListener !== listener
    );
    if (this.globalListeners.length === 0) {
      this.emitter.off('*', this.globalListener);
    }
  }
}

export default Field;
