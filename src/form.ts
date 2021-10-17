import Field, {Listener} from './field';

export type FormProps = {
  initValues: Record<string, any>;
  validateSchema: any;
  options?: Options;
};

type Options = {
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
};

class Form {
  options: Options = {
    validateOnChange: true,
    validateOnBlur: true,
  };
  fields: Record<string, Field> = {};
  f: Record<string, Field> = null;
  validateSchema = null;
  globalListeners: Listener[] = [];
  globalFieldListener = (field: Field) => {
    this.globalListeners.forEach((globalListener) => globalListener(field));
  };

  constructor({initValues, validateSchema, options}: FormProps) {
    this.f = this.fields;
    this.validateSchema = validateSchema;
    this.options = {...this.options, ...options};
    Object.entries(initValues).forEach(([name, value]) => {
      this.fields[name] = new Field({
        name,
        value,
        getForm: () => this,
      });
    });
  }

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

  // async validate() {
  //   let error = false;
  //   for (const [name, field] of Object.entries(this.fields)) {
  //     try {
  //       await this.validationsSchema.validateAt(name, field.value);
  //     } catch (error) {
  //       error = true;
  //     }
  //   }
  //   return !error;
  // }
  //
  // setFieldValue(name, value) {
  //
  // }

  getValues() {
    return Object.entries(this.fields).reduce((store, [name, field]) => {
      store[name] = field.value;
      return store;
    }, {});
  }
}

export default Form;
