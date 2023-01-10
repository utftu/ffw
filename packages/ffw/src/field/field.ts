import Form from '../form/form.js';
import ee from 'utftu/ee.js';

const defaultTest = async () => '';

type TestFunc = (value: any) => Promise<string>;
type Listener = any;

class Field<TValue, TForm extends Form<any>> {
  ee = ee();
  data: {
    value: TValue;
    error: string;
    touched: boolean;
  };
  test: TestFunc;
  form: TForm;
  initParams: {
    value: TValue;
    touched: boolean;
    error: string;
    test: TestFunc;
  };

  constructor(props: {
    value: TValue;
    error: string;
    touched: boolean;
    test: TestFunc;
    form: TForm;
  }) {
    const {
      value = '' as TValue,
      touched = false,
      error = '',
      test = defaultTest,
      form,
    } = props;
    this.form = form;
    this.test = defaultTest;

    this.initParams = {
      value,
      touched,
      error,
      test,
    };
    this.test = test;

    this.data.value = value;
    this.data.error = error;
    this.data.touched = touched;

    form.addField(this);
  }

  get value() {
    return this.data.value;
  }

  set value(newValue) {
    this.set(newValue);
  }

  get error() {
    return this.data.error;
  }

  set error(newError) {
    this.setError(newError);
  }

  get touched() {
    return this.data.touched;
  }

  set touched(newTouched) {
    this.setTouched(newTouched);
  }

  get errorTouched() {
    if (this.data.touched === false) {
      return '';
    }
    return this.data.error;
  }

  setData<TData>(name: string, newData: TData) {
    const prevData = this.data[name];
    if (prevData === newData) {
      return;
    }
    const oldErrorTouched = this.errorTouched;
    this.data[name] = newData;
    this.form.calls.add(this, name, () => this.ee.emit(name, newData));
    this.form.calls.add(this.form, '*', () => this.form.ee.emit('global'));

    if (name === 'error') {
      const oldError = prevData;
      const error = newData;
      if (error !== '' && oldError === '') {
        this.form._errors++;
        if (this.form._errors === 1) {
          this.form.calls.add(this.form, 'valid', () =>
            this.form.ee.emit('valid', false)
          );
        }
      } else if (error === '' && oldError !== '') {
        this.form._errors--;
        if (this.form._errors === 0) {
          this.form.calls.add(this.form, 'valid', () =>
            this.form.ee.emit('valid', true)
          );
        }
      }
    }

    if (name === 'error' || name === 'touched') {
      if (oldErrorTouched === this.errorTouched) {
        return;
      }
      this.form.calls.add(this, 'errorTouched', () =>
        this.ee.emit('errorTouched', this.errorTouched)
      );
    }
  }

  update() {
    this.form.calls.add(this, '*', () => this.ee.emit('*'));
    this.form.calls.add(this.form, '*', () => this.form.ee.emit('*'));
  }

  setError(error: string) {
    this.setData('error', error);
  }

  setTouched(touched: boolean) {
    this.setData('touched', touched);
  }

  set(value: TValue, validate?: boolean) {
    this.setData('value', value);

    if (validate === true) {
      this.validate();
      return;
    }

    if (validate === false) {
      return;
    }

    if (validate === undefined && this.form.options.validateOnChange) {
      this.validate();
    }
  }

  async validate() {
    const error = await this.test(this.data.value);

    this.setError(error);

    return error;
  }

  on(name: string, cb: Listener) {
    this.ee.on(name, cb);

    return () => this.ee.off(name, cb);
  }

  off(name: string, cb: Listener) {
    return () => this.ee.off(name, cb);
  }

  onInput = (event: {
    target: {
      value: string;
    };
  }) => {
    this.set(event.target.value as TValue);
  };

  onBlur = () => {
    this.setTouched(true);

    if (this.form.options.validateOnBlur) {
      this.validate();
    }
  };

  reset() {
    this.setData('value', this.initParams.value);
    this.setData('touched', this.initParams.touched);
    this.setData('error', this.initParams.error);
  }
}

export default Field;
