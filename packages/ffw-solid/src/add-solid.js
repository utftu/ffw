import createStore from './create-store/create-store.js';

function createStore(name, value, ee) {
  return createStore(
    () => value,
    (cb) => {
      ee.on(name, cb);
      return () => ee.off(name, cb);
    }
  );
}

function transformForm(form) {
  form.solid = {};
  form.solid.makeStore = (name, value) => {
    form.solid[name] = createStore(name, value, form.ee);
  };
  form.solid.makeStore('valid', form.valid);
  form.solid.makeStore('global', null);

  const oldCreateField = form.createField;
  form.createField = function (...args) {
    const field = oldCreateField.call(form, ...args);
    transformField(field);
  };
}

function transformField(field) {
  field.solid = {};
  field.solid.makeStore = (name, value) => {
    form.solid[name] = createStore(name, value, field.ee);
  };

  for (const name in data) {
    field.solid.makeStore(name, data[name]);
  }
  field.solid.makeStore('errorTouched', field.errorTouched);
  field.solid.makeStore('global', null);
}

function addSolid(form) {
  transformForm(form);
}

export default addSolid;
