import findAsync from '../transform-structure/find-async.js';
import find from '../transform-structure/find.js';
import transform from '../transform-structure/transform.js';
import {Atom} from 'strangelove';
import Field from '../field/field.js';

function traceFields(fields, getProperty) {
  return transform(
    fields,
    (field) => {
      return traceFields(getProperty(field), getProperty);
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

  root = new Root({
    updater: new SyncUpdater(),
  });

  initAtoms() {
    const form = this;
    this.atoms.valid = new AtomSync({
      value: new ReadValueSync({
        get() {
          return form.valid;
        },
      }),
    });
    this.atoms.global = new AtomSync({
      value: new ReadValueSync({
        get() {
          return form;
        },
      }),
    });
  }

  atoms = {};

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
    this.initAtoms();

    const form = this;

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
      field.atoms.value.value.setCache(defaultValue);
    }

    if (this.options.validateOnMount) {
      this.validate();
    }
  }

  async validate() {
    return Promise.all([...this._flatFields].map((field) => field.validate()))
      .then(() => {
        return true;
      })
      .catch(() => {
        return false;
      });
  }

  getValid() {
    if (this._errors === 0) {
      return true;
    }
    return false;
  }

  get valid() {
    return this.getValid();
    // const flattedFields = flatFields(this.fields);
    // const errors = flattedFields.map((field) => field.error());
    // if (errors.every((error) => error === '')) {
    //   return true;
    // }
    // return false;
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
      return traceFields(data, (field) => {
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
    return traceFields(this.fields, (field) => field.value);
  }

  getErrors() {
    return traceFields(this.fields, (field) => {
      if (find(field.value, (data) => data instanceof Field)) {
        return field.value;
      } else {
        return field.error;
      }
    });
  }

  getTouches() {
    return traceFields(this.fields, (field) => {
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
    Atom.connect(field.atom, this.atoms.global);
    Atom.connect(field.atoms.value, this.atoms.values);
    Atom.connect(field.atoms.touched, this.atoms.touches);
    Atom.connect(field.atoms.error, this.atoms.errors);

    for (const fieldAtom of field.atoms) {
      Atom.connect(fieldAtom, this.atoms.global);
    }
  }
  removeField(field) {
    if (field.error !== '') {
      this._errors--;
    }
    this._flatFields.delete(field);
    Atom.disconnect(field.atom, this.atoms.global);
    Atom.disconnect(field.atoms.value, this.atoms.values);
    Atom.disconnect(field.atoms.touched, this.atoms.touches);
    Atom.disconnect(field.atoms.error, this.atoms.errors);

    for (const fieldAtom of field.atoms) {
      Atom.disconnect(fieldAtom, this.atoms.global);
    }
  }
}

export default Form;
