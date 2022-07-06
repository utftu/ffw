import mitt from 'mitt';
// import createLazyFunc from 'utftu/createLazyFunc';
import createLazyFunc from 'utftu/dist/create-lazy-func/esm/dev.js';

class Field {
  name = '';
  form = null;
  emitter = null;

  data = {
    value: '',
    error: '',
    touched: false,
  };

  constructor({name, value = '', touched = false, error = '', form = null}) {
    this.emitter = mitt();
    this.name = name;
    this.form = form;

    this.data.value = value;
    this.data.touched = touched;
    this.data.error = error;

    const field = this;
    const lazyEmitErrorTouched = createLazyFunc(
      () => {
        const errorTouched = this.errorTouched;
        this.emitter.emit('errorTouched', errorTouched);
        this.form.emitter.emit(
          `ffw.fields.${field.name}.errorTouched`,
          errorTouched
        );
      },
      () => [this.errorTouched],
      [this.errorTouched]
    );
    this.emitter.on('error', lazyEmitErrorTouched);
    this.emitter.on('touched', lazyEmitErrorTouched);
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

  get errorTouched() {
    if (this.touched === false) {
      return '';
    } else {
      return this.error;
    }
  }

  get touched() {
    return this.data.touched;
  }

  set touched(newTouched) {
    this.setTouched(newTouched);
  }

  setData(name, newData) {
    if (this.form.options.checkPrevData && this.data[name] === newData) {
      return;
    }

    this.data[name] = newData;

    if (name === 'error') {
      this.form.calls.addCall('ffw.valid', () => {
        this.form.emitter.emit('ffw.valid');
      });
    }

    this.form.calls.addCall(`ffw.fields.${this.name}.data.${name}`, () => {
      this.emitter.emit(name, this.data[name]);
      this.form.emitter.emit(
        `ffw.fields.${this.name}.data.${name}`,
        this.data[name]
      );
    });
  }

  setError(error) {
    this.setData('error', error);
  }

  setTouched(touched) {
    this.setData('touched', touched);
  }

  set(value, validate = true) {
    this.setData('value', value);

    if (validate) {
      this.validate();
    }
  }

  async validate() {
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

  subscribe(name, listener) {
    this.emitter.on(name, listener);

    return () => this.emitter.off(name, listener);
  }

  unsubscribe(name, listener) {
    this.emitter.off(name, listener);
  }

  onChange = (event) => {
    this.set(event.target.value, false);

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

  globalListeners = [];
  globalListener = (...args) => {
    this.globalListeners.forEach((listener) => listener(this, ...args));
  };
  addGlobalListener(listener) {
    if (this.globalListeners.length === 0) {
      this.emitter.on('*', this.globalListener);
    }
    this.globalListeners.push(listener);
  }
  removeGlobalListener(listener) {
    this.globalListeners = this.globalListeners.filter(
      (globalListener) => globalListener !== listener
    );
    if (this.globalListeners.length === 0) {
      this.emitter.off('*', this.globalListener);
    }
  }
}

export default Field;
