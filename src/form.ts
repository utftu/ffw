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

  private iterateFields(cb: (field: Field) => void) {
    for (const fieldKey in this.fields) {
      cb(this.fields[fieldKey]);
    }
  }

  addGlobalListener(listener: Listener) {
    if (this.globalListeners.length === 0) {
      this.iterateFields((field) => {
        field.listeners.push(this.globalFieldListener);
      });
    }
    this.globalListeners.push(listener);
  }

  removeGlobalListener(listener: Listener) {
    this.globalListeners = this.globalListeners.filter(
      (globalListener) => listener !== globalListener
    );
    if (this.globalListeners.length === 0) {
      this.iterateFields((field) => {
        field.listeners = field.listeners.filter(
          (fieldListener) => this.globalFieldListener !== fieldListener
        );
      });
    }
  }

  addField(name: string, field: Field) {
    this.fields[name] = field;

    if (this.globalListeners.length) {
      this.fields[name].listeners.push(this.globalFieldListener);
    }
  }

  getField(name) {
    if (!(name in this.fields)) {
      this.addField(
        name,
        new Field({
          name,
          getForm: () => this,
        })
      );
    }
    return this.fields[name];
  }

  private triggerFields() {
    batch(() => {
      this.iterateFields((field) => {
        field.triggerListeners();
      });
    });
  }

  constructor({initValues, validateSchema, onSubmit, options = {}}: FormProps) {
    this.f = this.fields;
    this.validateSchema = validateSchema;
    this.options = {...this.options, ...options};
    this.onSubmit = onSubmit;
    this.initValues = initValues;

    for (const initValueKey in initValues) {
      this.addField(
        initValueKey,
        new Field({
          value: initValues[initValueKey],
          name: initValueKey,
          getForm: () => this,
        })
      );
    }

    for (const validateFieldKey in validateSchema.fields) {
      this.getField(validateFieldKey);
    }

    if (options.validateOnMount) {
      this.validate();
    }
  }

  async validate() {
    let error = false;
    this.iterateFields(async (field) => {
      const fieldValid = await field.validate();
      if (!fieldValid) {
        error = true;
      }
    });
    return !error;
  }

  submit = async () => {
    const formValid = await this.validate();
    if (formValid) {
      this.onSubmit(this);
    }
  };

  reset() {
    this.iterateFields(async (field) => {
      field.value =
        field.name in this.initValues ? this.initValues[field.name] : '';
      field.error = '';
      field.touched = false;
    });

    this.triggerFields();
  }

  setErrors(errors: Record<string, string>) {
    this.batch(() => {
      for (const errorKey in errors) {
        const field = this.getField(errorKey);
        field.error = errors[errorKey];
        field.triggerListeners();
      }
    });
  }

  setTouches(touches: Record<string, boolean>) {
    this.batch(() => {
      for (const touchedKey in touches) {
        const field = this.getField(touchedKey);
        field.touched = touches[touchedKey];
        field.triggerListeners();
      }
    });
  }

  setValues(values: Record<string, any>) {
    this.batch(() => {
      for (const valueKey in values) {
        const field = this.getField(valueKey);
        field.value = values[valueKey];
        field.triggerListeners();
      }
    });
  }

  getErrors(): Record<string, string> {
    const store = {};
    this.iterateFields(async (field) => {
      if (field.error) {
        store[field.name] = field.error;
      }
    });
    return store;
  }

  getTouches(): Record<string, boolean> {
    const store = {};
    this.iterateFields(async (field) => {
      store[field.name] = field.touched;
    });
    return store;
  }

  getValues(): Record<string, any> {
    const store = {};
    this.iterateFields(async (field) => {
      store[field.name] = field.value;
    });
    return store;
  }

  batch(cb) {
    batch(cb);
  }
}

export default Form;
