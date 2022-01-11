import Field, {Listener} from './field';

export type FormProps = {
  initValues?: Record<string, any>;
  validateSchema?: any;
  options?: Options;
  onSubmit?: (form: Form) => void;
  batch?: any;
  createField?: (form: Form, name: string) => Field;
};

type Options = {
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  validateOnMount?: boolean;
  checkPrevData?: boolean;
};

class Form<FieldType extends Field = Field> {
  options: Options = {
    validateOnChange: true,
    validateOnBlur: true,
    validateOnMount: false,
    checkPrevData: true,
  };
  fields: Record<string, any> = {};
  f: Record<string, any> = null;
  validateSchema = null;
  onSubmit: (form: Form) => void = null;
  globalListeners: any[] = [];
  globalFieldListener = (field: any, type: string, event: any) => {
    this.globalListeners.forEach((globalListener) =>
      globalListener(field, type, event)
    );
  };
  initValues: Record<string, any> = null;
  batch(cb) {
    cb();
  }

  private iterateFields(cb: (field: Field) => void) {
    for (const fieldKey in this.fields) {
      cb(this.fields[fieldKey]);
    }
  }

  addGlobalListener(listener: Listener) {
    if (this.globalListeners.length === 0) {
      this.iterateFields((field) => {
        field.addGlobalListener(this.globalFieldListener);
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
        field.removeGlobalListener(this.globalFieldListener);
      });
    }
  }

  addField(name: string, field: any) {
    this.fields[name] = field;

    if (this.globalListeners.length) {
      this.fields[name].addGlobalListener(this.globalFieldListener);
    }
  }

  createField(name: string) {
    return new Field({
      name,
      form: this,
    });
  }

  getField(name) {
    if (!(name in this.fields)) {
      this.addField(name, this.createField(name));
    }
    return this.fields[name];
  }

  constructor(props: FormProps) {
    let validateSchema;

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

    this.f = this.fields;
    this.validateSchema = validateSchema;
    this.options = {...this.options, ...props.options};
    this.onSubmit = props.onSubmit ?? function () {};
    this.initValues = props.initValues ?? {};
    if (props.batch) {
      this.batch = props.batch;
    }
    if (props.createField) {
      this.createField = (name) => props.createField(this, name);
    }

    for (const initValueKey in this.initValues) {
      const field = this.getField(initValueKey);
      field.set(this.initValues[initValueKey]);
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
    for (const fieldKey in this.fields) {
      const field = this.getField(fieldKey);
      const fieldValid = await field.validate();
      if (!fieldValid) {
        error = true;
      }
    }
    return !error;
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
          field.name in this.initValues ? this.initValues[field.name] : ''
        );
        field.setError('');
        field.setTouched(false);
      });
    });
  }

  setValue(name: string, value: any) {
    return this.getField(name).set(value);
  }

  setTouched(name: string, touched: boolean) {
    return this.getField(name).setTouched(touched);
  }

  setError(name: string, error: string) {
    return this.getField(name).setError(error);
  }

  setValues(values: Record<string, any>) {
    this.batch(() => {
      for (const valueKey in values) {
        const field = this.getField(valueKey);
        field.set(values[valueKey]);
      }
    });
  }

  setErrors(errors: Record<string, string>) {
    this.batch(() => {
      for (const errorKey in errors) {
        const field = this.getField(errorKey);
        field.setError(errors[errorKey]);
      }
    });
  }

  setTouches(touches: Record<string, boolean>) {
    this.batch(() => {
      for (const touchedKey in touches) {
        const field = this.getField(touchedKey);
        field.setTouched(touches[touchedKey]);
      }
    });
  }

  getValues(): Record<string, any> {
    const store = {};
    this.iterateFields((field) => {
      store[field.name] = field.value;
    });
    return store;
  }

  getErrors(): Record<string, string> {
    const store = {};
    this.iterateFields((field) => {
      if (field.error) {
        store[field.name] = field.error;
      }
    });
    return store;
  }

  getTouches(): Record<string, boolean> {
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
