import ee from 'utftu/ee.js';
import DelayedCalls from '../delayed-calls/delayed-calls.js';
import find from '../transform-structure/find.js';
import transform from '../transform-structure/transform.js';
import Field from '../field/field.js';

function transformFields(fields, getProperty) {
  return transform(
    fields,
    (field) => {
      return transformFields(getProperty(field), getProperty);
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

  createField(props = {}) {
    return new Field({
      form: this,
      ...props,
    });
  }

  getField(name) {
    if (!(name in this.fields)) {
      this.addField(name, this.createField(name));
    }
    return this.fields[name];
  }

  _getFieldOrCreate(target, name) {
    if (!target[name]) {
      target[name] = this.createField(this);
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
      this.createField = (name) => props.createField(this, name);
    }

    const validateObj =
      typeof props.validateSchema === 'function'
        ? props.validateSchema(this)
        : props.validateSchema;

    for (const fieldName in validateObj) {
      const test = validateObj[fieldName];
      const field = this._getFieldOrCreate(this.fields, fieldName);
      field.test = test;
    }

    for (const fieldName in this.initValues) {
      const defaultValue = this.initValues[fieldName];
      const field = this._getFieldOrCreate(this.fields, fieldName);
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
    // return Promise.all([...this._flatFields].map((field) => field.validate()))
    //   .then(() => {
    //     return true;
    //   })
    //   .catch(() => {
    //     return false;
    //   });
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

  getStructure() {
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
    const values = transformFields(this.fields, (field) => field.value);
    console.log('-----', 'values', values);
    return values;
  }

  getErrors() {
    const errors = transformFields(this.fields, (field) => {
      if (find(field.value, (data) => data instanceof Field)) {
        return field.value;
      } else {
        if (field.error !== '') {
          return field.error;
        }
      }
    });

    return errors;
  }

  getTouches() {
    return transformFields(this.fields, (field) => {
      if (find(field.value, (data) => data instanceof Field)) {
        return field.value;
      } else {
        return field.touched;
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
