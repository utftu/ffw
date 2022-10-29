import transformStructure from '../transform-structure/transform-structure.js';
import {Root, AtomSync, ReadValueSync, Atom, SyncUpdater} from 'strangelove';
import Field from '../field/field.js';

function flatFields(fields) {
  const flatFields = [];
  transformStructure(
    fields,
    (field) => {
      flatFields.push(field);
    },
    (target) => target instanceof Field
  );
  return flatFields;
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
    this.atoms.values = new AtomSync({
      value: new ReadValueSync({
        get() {
          return form.getValues();
        },
      }),
    });
    this.atoms.errors = new AtomSync({
      value: new ReadValueSync({
        get() {
          return form.getErrors();
        },
      }),
    });
    this.atoms.touches = new AtomSync({
      value: new ReadValueSync({
        get() {
          return form.getErrors();
        },
      }),
    });
    this.atoms.valid = new AtomSync({
      onBeforeUpdate(atom) {
        if (atom.value.get() === form.valid) {
          return false;
        }
        return true;
      },
      value: new ReadValueSync({
        get() {
          return form.valid;
        },
      }),
    });
    Atom.connect(this.atoms.valid, this.atoms.errors);
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

  createField(form, props = {}) {
    return new Field({
      form,
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
    const flattedFields = flatFields(this.fields);
    const errors = await Promise.all(
      flattedFields.map((field) => field.validate())
    );
    if (errors.every((error) => error === '')) {
      return true;
    }
    return false;
  }

  get valid() {
    const flattedFields = flatFields(this.fields);
    const errors = flattedFields.map((field) => field.error());
    if (errors.every((error) => error === '')) {
      return true;
    }
    return false;
  }

  submit = async () => {
    const formValid = await this.validate();
    if (formValid) {
      return this.onSubmit(this);
    }
  };

  reset() {
    const flattedFields = flatFields(this.fields);
    flattedFields.forEach((field) => field.reset());
  }

  getValues() {
    return transformStructure(
      this.fields,
      (field) => field.value,
      (value) => value instanceof Field
    );
  }

  getErrors() {
    return transformStructure(
      this.fields,
      (field) => field.error,
      (value) => value instanceof Field
    );
  }

  getTouches() {
    return transformStructure(
      this.fields,
      (field) => field.touched,
      (value) => value instanceof Field
    );
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
