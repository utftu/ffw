'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var react = require('react');

const context = react.createContext(null);

class Field {
  value = '';
  touched = false;
  error = '';
  name = '';
  getForm = null;
  listeners = [];

  constructor({
    name,
    value = '',
    touched = false,
    error = '',
    getForm
  }) {
    this.getForm = getForm;
    this.name = name;
    this.value = value;
    this.touched = touched;
    this.error = error;
  }

  setError(error) {
    this.error = error;
    this.triggerListeners();
  }

  setTouched(touched) {
    this.touched = touched;
    this.triggerListeners();
  }

  set(value) {
    this.value = value;
    this.triggerListeners();
  }

  async validate() {
    const fieldSchema = this.getForm().validateSchema.fields[this.name];

    if (!fieldSchema) {
      return;
    }

    try {
      await fieldSchema.validate(this.value);
    } catch (error) {
      this.setError(error.errors[0]);
    }
  }

  onChange = event => {
    this.set(event.target.value);

    if (this.getForm().options.validateOnChange) {
      this.validate();
    }
  };
  onBlur = () => {
    this.setTouched(true);

    if (this.getForm().options.validateOnBlur) {
      this.validate();
    }
  };
  getInputField = () => {
    return {
      value: this.value,
      name: this.name,
      onChange: this.onChange,
      onBlur: this.onBlur
    };
  };
  getSelectField = () => {
    return {
      value: this.value,
      name: this.name,
      onChange: value => {
        this.value = value;
        this.touched = true;
        this.triggerListeners();

        if (this.getForm().options.validateOnChange || this.getForm().options.validateOnBlur) {
          this.validate();
        }
      },
      onBlur: this.onBlur
    };
  };

  triggerListeners() {
    this.listeners.forEach(listener => listener(this)); // unstable_batchedUpdates(() => {
    //   this.listeners.forEach((listener) => listener(this));
    // })
  }

}

function createNonExistField(form, name) {
  if (!form.fields[name]) {
    form._addField(name, new Field({
      name,
      getForm: () => form,
      value: ''
    }));
  }
}

function createFormProxy(form, deps) {
  function checkAndThrow(property) {
    if (!deps.includes(property)) {
      throw new Error(`You don't have access to field with name - ${property}`);
    }
  }

  return new Proxy(form, {
    get(target, property) {
      if (property === 'fields' || property === 'f') {
        return new Proxy(form.fields, {
          get(target, property) {
            checkAndThrow(property);
            return target[property];
          }

        });
      }

      return {
        __proto__: target // setFieldValue(name, ...args) {
        //   checkAndThrow(name)
        //   target.setFieldValue(name, ...args)
        // }

      };
    }

  });
}

function useForm(...deps) {
  const form = react.useContext(context);
  const [, setUpdate] = react.useState(null);
  react.useMemo(() => {
    deps.forEach(name => {
      createNonExistField(form, name);
    });
  }, deps);
  const proxyForm = react.useMemo(() => {
    if (process.env.NODE_ENV === 'development') {
      return createFormProxy(form, deps);
    } else {
      return null;
    }
  }, []); // todo subscribe on memo

  react.useEffect(() => {
    const listener = () => {
      setUpdate({});
    };

    if (deps.length === 0) {
      form._addGlobalListener(listener);
    } else {
      deps.forEach(fieldName => {
        form.fields[fieldName].listeners = [...form.fields[fieldName].listeners, listener];
      });
    }

    return () => {
      if (deps.length === 0) {
        form._addGlobalListener(listener);
      } else {
        deps.forEach(fieldName => {
          form.fields[fieldName].listeners = form.fields[fieldName].listeners.filter(listenerComp => listenerComp !== listener);
        });
      }
    };
  }, deps);

  if (process.env.NODE_ENV === 'development') {
    return proxyForm;
  } else {
    return form;
  }
}

class Form {
  options = {
    validateOnChange: true,
    validateOnBlur: true
  };
  fields = {};
  f = null;
  validateSchema = null;
  globalListeners = [];
  globalFieldListener = field => {
    this.globalListeners.forEach(globalListener => globalListener(field));
  };

  constructor({
    initValues,
    validateSchema,
    options
  }) {
    this.f = this.fields;
    this.validateSchema = validateSchema;
    this.options = { ...this.options,
      ...options
    };
    Object.entries(initValues).forEach(([name, value]) => {
      this.fields[name] = new Field({
        name,
        value,
        getForm: () => this
      });
    });
  }

  _addGlobalListener(listener) {
    if (this.globalListeners.length === 0) {
      Object.values(this.fields).forEach(field => {
        field.listeners.push(this.globalFieldListener);
      });
    }

    this.globalListeners.push(listener);
  }

  _removeGlobalListener(listener) {
    this.globalListeners = this.globalListeners.filter(globalListener => listener !== globalListener);

    if (this.globalListeners.length === 0) {
      Object.values(this.fields).forEach(field => {
        field.listeners = field.listeners.filter(fieldListener => this.globalFieldListener !== fieldListener);
      });
    }
  }

  _addField(name, field) {
    this.fields[name] = field;

    if (this.globalListeners.length) {
      this.fields[name].listeners.push(this.globalFieldListener);
    }
  } // async validate() {
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

function useGlobalForm(options) {
  return react.useMemo(() => {
    return new Form(options);
  }, []);
}

const Provider = context.Provider;

exports.FfsProvider = Provider;
exports.useFfs = useForm;
exports.useGlobalFfs = useGlobalForm;
