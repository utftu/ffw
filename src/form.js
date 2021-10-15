import Field from './field.js';

class Form {
  options = {
    validateOnChange: true,
    validateOnBlur: true,
  };
  fields = {};
  f = null;
  validationsSchema = null;
  globalListeners = [];
  globalFieldListener = (field) => {
    this.globalListeners.forEach((globalListener) => globalListener(field));
  };

  constructor({initValues, validateSchema: validationSchema, options}) {
    this.f = this.fields;
    this.validationsSchema = validationSchema;
    this.options = {...this.options, ...options};
    Object.entries(initValues).forEach(([name, value]) => {
      this.fields[name] = new Field({
        name,
        value,
        form: this,
        getForm: () => this,
      });
    });
  }

  _addGlobalListener(listener) {
    if (this.globalListeners.length === 0) {
      Object.values(this.fields).forEach((field) => {
        field.listeners.push(this.globalFieldListener);
      });
    }
    this.globalListeners.push(listener);
  }

  _removeGlobalListener(listener) {
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

  _addField(name, field) {
    this.fields[name] = field;

    if (this.globalListeners.length) {
      this.fields[name].listeners.push(this.globalListeners);
    }
  }

  async validate() {
    let error = false;
    for (const [name, field] of Object.entries(this.fields)) {
      try {
        await this.validationsSchema.validateAt(name, field.value);
      } catch (error) {
        error = true;
      }
    }
    return !error;
  }
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
