import createStore from '../create-store/create-store.js';

function createConnectedStore(name, value, ee) {
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
    form.solid[name] = createConnectedStore(name, value, form.eeSync);
  };
  form.solid.makeStore('valid', form.valid);
  form.solid.makeStore('global', null);

  const oldCreateField = form.createField;
  form.createField = function (...args) {
    const field = oldCreateField.call(form, ...args);
    transformField(field);
    return field;
  };
}

function transformField(field) {
  field.solid = {};
  field.solid.makeStore = (name, value) => {
    field.solid[name] = createConnectedStore(name, value, field.eeSync);
  };

  for (const name in field.data) {
    field.solid.makeStore(name, field.data[name]);
  }
  field.solid.makeStore('errorTouched', field.errorTouched);
  field.solid.makeStore('global', null);
}

export const addSolidPlugin = () => (form) => {
  transformForm(form);
};
