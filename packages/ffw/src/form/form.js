import ee from 'utftu/ee.js';
import DelayedCalls from '../delayed-calls/delayed-calls.js';
import Field from '../field/field.js';
import find from '../transform-structure/find.js';
import transform from '../transform-structure/transform.js';

transformFields.PASS = transform.PASS;
function transformFields(fields, getProperty) {
  return transform(
    fields,
    (field) => {
      const newValue = getProperty(field);
      if (newValue === transformFields.PASS) {
        return transformFields.PASS;
      }
      return transformFields(newValue, getProperty);
    },
    (target) => target instanceof Field
  );
}

class Form {
  options = {
    validateOnChange: true,
    validateOnBlur: true,
    validateOnMount: false,
    checkPrevData: true,
  };
  fields = {};
  f = null;
  validateSchema = {};
  onSubmit = () => {};
  initValues = {};

  calls = new DelayedCalls();
  ee = ee();

  batch(cb) {
    cb();
  }

  createField(form, props = {}) {
    return new Field({
      form,
      ...props,
    });
  }

  _getFlatField(name) {
    if (!(name in this.fields)) {
      this.addField(name, this.createField(this));
    }
    return this.fields[name];
  }

  _getFlatFieldOrCreate(target, name) {
    if (!target[name]) {
      target[name] = this.createField(this, {name: name});
    }
    return target[name];
  }

  constructor(props = {}) {
    this.f = this.fields;

    this.options = {...this.options, ...props.options};
    this.onSubmit = props.onSubmit ?? (() => {});
    this.initValues = props.initValues ?? {};

    if (props.batch) {
      this.batch = props.batch;
    }
    if (props.createField) {
      this.createField = (config) => props.createField(this, config);
    }

    const validateObj =
      typeof props.validateSchema === 'function'
        ? props.validateSchema(this)
        : props.validateSchema;

    for (const fieldName in validateObj) {
      const test = validateObj[fieldName];
      const field = this._getFlatFieldOrCreate(this.fields, fieldName);
      field.test = test;
    }

    for (const fieldName in this.initValues) {
      const defaultValue = this.initValues[fieldName];
      const field = this._getFlatFieldOrCreate(this.fields, fieldName);
      field.initParams.value = defaultValue;
      field.data.value = defaultValue;
    }

    if (this.options.validateOnMount) {
      this.validate();
    }
  }

  async validate() {
    const errors = await Promise.all(
      [...this._flatFields].map((field) => field.validate())
    );
    return errors.every((error) => error === '');
  }

  getValid() {
    if (this._errors === 0) {
      return true;
    }
    return false;
  }

  get valid() {
    return this.getValid();
  }

  submit = async () => {
    const formValid = await this.validate();
    if (formValid) {
      return this.onSubmit(this);
    }
  };

  reset() {
    for (const field of this._flatFields) {
      field.reset();
    }
  }

  getData() {
    function rec(data) {
      return transformFields(data, (field) => {
        return {
          error: field.error,
          touched: field.touched,
          value: rec(field.value),
        };
      });
    }
    return rec(this.fields);
  }

  getValues() {
    return transformFields(this.fields, (field) => field.value);
  }

  getErrors() {
    return transformFields(this.fields, (field) => {
      if (find(field.value, (data) => data instanceof Field)) {
        return field.value;
      } else {
        if (field.error !== '') {
          return field.error;
        }
        return transformFields.PASS;
      }
    });
  }

  getTouches() {
    return transformFields(this.fields, (field) => {
      if (find(field.value, (data) => data instanceof Field)) {
        return field.value;
      } else {
        if (field.touched === true) {
          return field.touched;
        }
        return transformFields.PASS;
      }
    });
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

  on(name, cb) {
    this.ee.on(name, cb);

    return () => this.ee.off(name, cb);
  }

  off(name, cb) {
    return () => this.ee.off(name, cb);
  }

  _errors = 0;
  _flatFields = new Set();
  addField(field) {
    if (field.error !== '') {
      this._errors++;
    }
    this._flatFields.add(field);
  }
  removeField(field) {
    if (field.error !== '') {
      this._errors--;
    }
    this._flatFields.delete(field);
  }
}

export default Form;
