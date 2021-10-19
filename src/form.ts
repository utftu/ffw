import Field, {Listener} from './field';
import {batch} from './utils';

export type FormProps = {
  initValues: Record<string, any>;
  validateSchema: any;
  options?: Options;
  onSubmit?: (form: Form) => void;
};

type Options = {
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  validateOnMount?: boolean;
};

class Form {
  options: Options = {
    validateOnChange: true,
    validateOnBlur: true,
  };
  fields: Record<string, Field> = {};
  f: Record<string, Field> = null;
  validateSchema = null;
  onSubmit: (form: Form) => void = null;
  globalListeners: Listener[] = [];
  globalFieldListener = (field: Field) => {
    this.globalListeners.forEach((globalListener) => globalListener(field));
  };
  initValues: Record<string, any> = null;

  _addGlobalListener(listener: Listener) {
    if (this.globalListeners.length === 0) {
      Object.values(this.fields).forEach((field) => {
        field.listeners.push(this.globalFieldListener);
      });
    }
    this.globalListeners.push(listener);
  }

  _removeGlobalListener(listener: Listener) {
    this.globalListeners = this.globalListeners.filter(
      (globalListener) => listener !== globalListener
    );
    if (this.globalListeners.length === 0) {
      Object.values(this.fields).forEach((field) => {
        field.listeners = field.listeners.filter(
          (fieldListener) => this.globalFieldListener !== fieldListener
        );
      });
    }
  }

  _addField(name: string, field: Field) {
    this.fields[name] = field;

    if (this.globalListeners.length) {
      this.fields[name].listeners.push(this.globalFieldListener);
    }
  }

  constructor({initValues, validateSchema, onSubmit, options = {}}: FormProps) {
    this.f = this.fields;
    this.validateSchema = validateSchema;
    this.options = {...this.options, ...options};
    this.onSubmit = onSubmit;
    this.initValues = initValues;

    Object.entries(initValues).forEach(([name, value]) => {
      this.fields[name] = new Field({
        name,
        value,
        getForm: () => this,
      });
    });

    Object.keys(validateSchema.fields).forEach((name) => {
      if (!this.fields[name]) {
        this.fields[name] = new Field({
          name,
          getForm: () => this,
        });
      }
    });

    if (options.validateOnMount) {
      this.validate();
    }
  }

  async validate() {
    for (const field of Object.values(this.fields)) {
      const fieldValid = await field.validate();
      if (!fieldValid) {
        return false;
      }
    }
    return true;
  }

  submit = async () => {
    const formValid = await this.validate();
    if (formValid) {
      this.onSubmit(this);
    }
  };

  reset() {
    const oldFields = this.fields;
    this.fields = this.f = {};

    // recreate empty fields
    Object.values(oldFields).forEach((oldField) => {
      this.fields[oldField.name] = new Field({
        name: oldField.name,
        getForm: () => this,
      });
      this.fields[oldField.name].listeners = oldField.listeners;
    });

    Object.entries(this.initValues).forEach(([name, value]) => {
      this.fields[name].value = value;
    });

    batch(() => {
      Object.values(this.fields).forEach((field) => {
        field.triggerListeners();
      });
    });
  }

  getErrors() {
    return Object.values(this.fields).reduce((store, field) => {
      store[field.name] = field.error;
      return store;
    }, {});
  }

  getTouches() {
    return Object.values(this.fields).reduce((store, field) => {
      store[field.name] = field.touched;
      return store;
    }, {});
  }

  getValues() {
    return Object.values(this.fields).reduce((store, field) => {
      store[field.name] = field.value;
      return store;
    }, {});
  }
}

export default Form;
