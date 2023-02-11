import {plugins} from '@swc/core';
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
        return transform.PASS;
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
    checkPrevData: false,
  };
  fields = {};
  f = null;
  onSubmit = () => {};
  calls = new DelayedCalls();
  ee = ee();

  notify(name, value) {
    this.calls.add(this, name, () => {
      this.ee.emit(name, value);
    });
    if (name !== 'global') {
      this.notify('global', [this, name, value]);
    }
  }

  batch(cb) {
    cb();
  }

  createField(props = {}) {
    return new Field(props);
  }

  _getFlatFieldOrCreate(name, props) {
    if (!this.fields[name]) {
      this.fields[name] = this.createField({name, form: this, ...props});
    }
    return this.fields[name];
  }

  constructor(
    props = {
      plugins: [],
    }
  ) {
    const plugins = props.plugins || [];
    this.f = this.fields;

    plugins.forEach((plugin) => plugin(this));

    this.options = {...this.options, ...props.options};
    this.onSubmit = props.onSubmit ?? (() => {});
    this.initValues = props.initValues ?? {};

    for (const fieldName in this.initValues) {
      const defaultValue = this.initValues[fieldName];
      this._getFlatFieldOrCreate(fieldName, {
        value: defaultValue,
      });
    }

    if (props.batch) {
      this.batch = props.batch;
    }

    const validateObj =
      typeof props.validateSchema === 'function'
        ? props.validateSchema(this)
        : props.validateSchema;

    for (const fieldName in validateObj) {
      const test = validateObj[fieldName];
      const field = this._getFlatFieldOrCreate(fieldName);
      field.test = test;
    }

    // if (this.options.validateOnMount) {
    //   this.validate();
    // }
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
