import mitt from 'mitt';

class Field {
  name = '';
  form = null;
  emitter = null;

  data = {
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

    this.form.calls.addCall(`${this.name}:${name}`,() => {
      this.emitter.emit(name, this.data[name]);
    })

    // this.form.batch(() => {
    //   this.emitter.emit(name, this.data[name]);
    // });
  }

  setError(error) {
    // console.log('-----', 'setError', error)
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

    // if (this.form.options.validateOnChange) {
    //   this.validate();
    // }
    // this.validate()
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
