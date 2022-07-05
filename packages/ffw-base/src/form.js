import Field from './field.js';
import DelayedCalls from './delayed-calls';
import mitt from 'mitt'

class Form {
  options = {
    validateOnChange: true,
    validateOnBlur: true,
    validateOnMount: false,
    checkPrevData: true,
  };
  _fields = {};
  fields = null;
  f = null;
  calls = null;
  validateSchema = null;
  onSubmit = null;
  globalListeners = [];
  // #if NODE_DEV
  debugEmitter = mitt()
  emitter = mitt();
  globalFieldListener = (field, type, event) => {
    // #if NODE_DEV
    this.debugEmitter.emit('globalFieldListener', [field, type, event])
    this.globalListeners.forEach((globalListener) =>
      globalListener(field, type, event)
    );
  };
  initValues = null;
  initData = null;

  batch(cb) {
    cb();
  }

  getFields() {
    return this._fields;
  }

  iterateFields(cb) {
    for (const name in this._fields) {
      cb(this.getField(name));
    }
  }

  addGlobalListener(listener) {
    if (this.globalListeners.length === 0) {
      this.iterateFields((field) => {
        field.addGlobalListener(this.globalFieldListener);
      });
    }
    this.globalListeners.push(listener);
  }

  removeGlobalListener(listener) {
    this.globalListeners = this.globalListeners.filter(
      (globalListener) => listener !== globalListener
    );
    if (this.globalListeners.length === 0) {
      this.iterateFields((field) => {
        field.removeGlobalListener(this.globalFieldListener);
      });
    }
  }

  addField(name, field) {
    this.fields[name] = field;

    if (this.globalListeners.length) {
      this.getField(name).addGlobalListener(this.globalFieldListener);
    }
  }

  createField(name) {
    return new Field({
      name,
      form: this,
    });
  }

  getField(name) {
    if (!(name in this._fields)) {
      this.addField(name, this.createField(name));
    }
    return this._fields[name];
  }

  constructor(props = {}) {
    let validateSchema;
    const form = this;

    if (props.validateSchema) {
      if (props.validateSchema instanceof Function) {
        validateSchema = props.validateSchema(this);
      } else {
        validateSchema = props.validateSchema;
      }
    } else {
      validateSchema = {
        fields: {},
      };
    }

    this.fields = new Proxy(this._fields, {
      get(_, prop) {
        return form.getField(prop);
      },
      set(target, prop, newValue) {
        Reflect.set(target, prop, newValue);
        return true;
      },
    });
    this.f = this.fields;
    this.validateSchema = validateSchema;
    this.options = {...this.options, ...props.options};
    this.onSubmit = props.onSubmit ?? function () {};
    this.initValues = props.initValues ?? {};
    this.initData = props.initData ?? {};
    if (props.batch) {
      this.batch = props.batch;
    }
    this.calls = new DelayedCalls(this.batch);
    if (props.createField) {
      this.createField = (name) => props.createField(this, name);
    }

    for (const initDataKey in this.initData) {
      const fieldData = this.initData[initDataKey];
      const field = this.getField(initDataKey);

      for (const fieldDataKey in fieldData) {
        field.data[fieldDataKey] = fieldData[fieldDataKey];
      }
    }

    for (const initValueKey in this.initValues) {
      const field = this.getField(initValueKey);
      field.data.value = this.initValues[initValueKey];
    }

    for (const validateFieldKey in this.validateSchema.fields) {
      this.getField(validateFieldKey);
    }

    if (this.options.validateOnMount) {
      this.validate();
    }
  }

  async validate() {
    let error = false;
    for (const fieldKey in this._fields) {
      const field = this.getField(fieldKey);
      const fieldValid = await field.validate();
      if (!fieldValid) {
        error = true;
      }
    }
    return !error;
  }
  
  get valid() {
    for (let key in this._fields) {
      const field = this._fields[key]
      if (field.error) {
        return false
      }
    }
    return true
  }

  submit = async () => {
    const formValid = await this.validate();
    if (formValid) {
      this.onSubmit(this);
    }
  };

  reset() {
    this.batch(() => {
      this.iterateFields((field) => {
        field.set(
          field.name in this.initValues ? this.initValues[field.name] : '',
          false
        );
        field.setError('');
        field.setTouched(false);
      });
    });
  }

  setValue(name, value) {
    return this.getField(name).set(value);
  }

  setTouched(name, touched) {
    return this.getField(name).setTouched(touched);
  }

  setError(name, error) {
    return this.getField(name).setError(error);
  }

  setValues(values) {
    this.batch(() => {
      for (const valueKey in values) {
        const field = this.getField(valueKey);
        field.set(values[valueKey], false);
      }
    });
  }

  setErrors(errors) {
    this.batch(() => {
      for (const errorKey in errors) {
        const field = this.getField(errorKey);
        field.setError(errors[errorKey]);
      }
    });
  }

  setTouches(touches) {
    this.batch(() => {
      for (const touchedKey in touches) {
        const field = this.getField(touchedKey);
        field.setTouched(touches[touchedKey]);
      }
    });
  }

  getValues() {
    const store = {};
    this.iterateFields((field) => {
      store[field.name] = field.value;
    });
    return store;
  }

  getErrors() {
    const store = {};
    this.iterateFields((field) => {
      if (field.error) {
        store[field.name] = field.error;
      }
    });
    return store;
  }

  getTouches() {
    const store = {};
    this.iterateFields((field) => {
      store[field.name] = field.touched;
    });
    return store;
  }

  get values() {
    return this.getValues();
  }

  get errors() {
    return this.getErrors();
  }

  get touches() {
    return this.getTouches();
  }
}

export default Form;
