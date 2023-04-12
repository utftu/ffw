import {createEventEmitter} from 'utftu/ee';

const defaultTest = () => '';

export class Field {
  form = null;

  eeSync = createEventEmitter();
  ee = createEventEmitter();

  notify(name, value) {
    this.eeSync.emit(name, value);
    this.form.calls.add(this, name, () => {
      this.ee.emit(name, value);
    });

    this.form.calls.add(this, 'global', () => {
      this.ee.emit('global', [this, name, value]);
    });
    this.form.notify('global', [this, name, value]);
  }

  data = {
    value: '',
    error: '',
    touched: false,
  };

  constructor({
    value = '',
    touched = false,
    error = '',
    test = defaultTest,
    form = null,
  } = {}) {
    this.form = form;
    this.test = test;

    this.initParams = {
      value,
      touched,
      error,
      test,
    };

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

  setDataPure(name, value) {}

  setData(name, newData) {
    const prevData = this.data[name];
    if (this.form.options.checkPrevData && prevData === newData) {
      return false;
    }
    const oldErrorTouched = this.errorTouched;
    this.data[name] = newData;

    this.notify(name, newData);

    if (name === 'error') {
      const oldError = prevData;
      const error = newData;
      if (error !== '' && oldError === '') {
        this.form._errors++;
        if (this.form._errors === 1) {
          this.form.notify('valid', false);
        }
      } else if (error === '' && oldError !== '') {
        this.form._errors--;
        if (this.form._errors === 0) {
          this.form.notify('valid', true);
        }
      }
    }

    if (name === 'error' || name === 'touched') {
      if (oldErrorTouched !== this.errorTouched) {
        this.notify('errorTouched', this.errorTouched);
      }
    }

    return true;
  }

  update() {
    this.form.calls.add(this, '*', () => this.ee.emit('*'));
    this.form.calls.add(this.form, '*', () => this.form.ee.emit('*'));
  }

  setError(error) {
    this.setData('error', error);
  }

  setTouched(touched) {
    this.setData('touched', touched);
  }

  set = (value, validate) => {
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
  };

  async validate() {
    const error = await this.test(this.data.value);

    this.setError(error);

    return error;
  }

  on(name, cb) {
    this.ee.on(name, cb);

    return () => this.ee.off(name, cb);
  }

  off(name, cb) {
    return () => this.ee.off(name, cb);
  }

  onNativeInput = (event) => {
    this.set(event.target.value);
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
