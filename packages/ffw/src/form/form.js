import {createEventEmitter} from 'utftu/ee';
import {DelayedCalls} from '../delayed-calls/delayed-calls.js';
import {Field} from '../field/field.js';

export class Form {
  static new(...args) {
    return new Form(...args);
  }

  options = {
    validateOnChange: true,
    validateOnBlur: true,
    checkPrevData: false,
  };
  fields = {};
  f = null;
  onSubmit = () => {};
  calls = new DelayedCalls();
  eeSync = createEventEmitter();
  ee = createEventEmitter();

  notify(name, value) {
    this.eeSync.emit(name, value);
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

  _prepareFieldData(func) {
    const data = {};
    for (const key in this.fields) {
      const funcResult = func(this.fields[key]);
      if (funcResult === undefined) {
        continue;
      }
      data[key] = func(this.fields[key]);
    }
    return data;
  }

  get values() {
    return this._prepareFieldData((field) => field.value);
  }

  get errors() {
    return this._prepareFieldData((field) => field.error || undefined);
  }

  get touches() {
    return this._prepareFieldData((field) => field.touched || undefined);
  }

  get data() {
    return this._prepareFieldData((field) => ({
      value: field.value,
      error: field.error,
      touched: field.touched,
    }));
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
