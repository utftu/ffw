import mitt from 'mitt';
import createLazyFunc from 'utftu/dist/create-lazy-func/esm/dev.js';
import {} from 'strangelove';

class Field {
  name = '';
  form = null;
  emitter = null;

  atoms = {};

  constructor({name, value = '', touched = false, error = '', form = null}) {
    this.form = form;

    this.atoms.value = form.root.createStateAtomSync(value);
    this.atoms.touched = form.root.createStateAtomSync(touched);
    this.atoms.error = form.root.createStateAtomSync(error);
    this.atoms.errorTouched = form.root.select(() => {
      if (!touched) {
        return '';
      }
      return error;
    });
  }

  get value() {
    return this.data.value.get();
  }

  set value(newValue) {
    this.set(newValue);
  }

  get error() {
    return this.data.error.get();
  }

  set error(newError) {
    this.setError(newError);
  }

  get errorTouched() {
    return this.atoms.errorTouched.get();
  }

  get touched() {
    return this.data.touched;
  }

  set touched(newTouched) {
    this.setTouched(newTouched);
  }

  setData(name, newData) {
    if (!this.atoms[name]) {
      const atom = this.form.root.createStateAtomSync(newData);
      this.atoms[name] = atom;
      if (this.form) {
      }
    }

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

  set(value, validate) {
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
    this.set(event.target.value);
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
