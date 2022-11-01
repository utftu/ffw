import findAsync from '../transform-structure/find-async.js';
import find from '../transform-structure/find.js';
import transform from '../transform-structure/transform.js';
import {
  Root,
  AtomSync,
  ReadValueSync,
  Atom,
  SyncUpdater,
  createStateAtomSyncRoot,
} from 'strangelove';
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

function flatFields(fields) {
  const flatFields = [];
  transform(
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
    this.atoms.atoms = new AtomSync();
    this.atoms.values = new AtomSync();
    this.atoms.errors = new AtomSync();
    this.atoms.touches = new AtomSync();
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
      console.log(
        '-----',
        'this.options.validateOnMount',
        this.options.validateOnMount
      );
      this.validate();
    }
  }

  async validate() {
    async function checkError(data) {
      const hasError = await findAsync(data, async (field) => {
        if (field instanceof Field) {
          const fieldError = await field.validate();
          if (fieldError !== '') {
            return true;
          }
          if (field._childrenFields.size > 0) {
            return checkError(field.value);
          }

          return false;
        }
      });
      return hasError;
    }

    const hasError = await checkError(this.fields);
    return !hasError;
    // return checkValid(this.fields, (field) => {
    //   if (field instanceof Field) {
    //     if (field._childrenFields.size > 0) {
    //       return checkValid(field.value);
    //     }
    //   }
    // });
    // return find(this.fields, (field) => {
    //   if (field instanceof Field) {
    //     if (field._childrenFields.size > 0) {
    //       return;
    //     }
    //   }
    // });
    // const flattedFields = flatFields(this.fields);
    // const errors = await Promise.all(
    //   flattedFields.map((field) => field.validate())
    // );
    // if (errors.every((error) => error === '')) {
    //   return true;
    // }
    // return false;
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

  getStructure() {
    function a(data) {
      return traceFields(data, (field) => {
        return {
          error: field.error,
          touched: field.touched,
          value: a(field.value),
        };
      });
    }
    return a(this.fields);
    // return traceFields(this.fields, (field) => {
    //   return {
    //     error: field.error,
    //     touched: field.touched,
    //     value: traceFields(field.value),
    //   };
    //   // field.value
    // });
  }

  getValues() {
    return traceFields(this.fields, (field) => field.value);
    // return transformStructure(
    //   this.fields,
    //   (field) => field.value,
    //   (value) => value instanceof Field
    // );
  }

  getErrors() {
    return traceFields(this.fields, (field) => {
      if (field._childrenFields.size === 0) {
        return field.error;
      }
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
    // return transform(
    //   this.fields,
    //   (field) => field.touched,
    //   (value) => value instanceof Field
    // );
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

  _flatFields = new Set();
  addField(field) {
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
