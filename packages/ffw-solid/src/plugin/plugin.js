import createStore from '../create-store/create-store.js';

function transformForm(form) {
  form.solid = {};
  form.solid.createStore = createStore;
  form.solid.valid = createStore(
    () => form.valid,
    (cb) => form.eeSync.on('valid', cb),
  );

  const oldCreateField = form.createField;
  form.createField = function (...args) {
    const field = oldCreateField.call(form, ...args);
    transformField(field);
    return field;
  };
}

function transformField(field) {
  field.solid = {};

  for (const name in field.data) {
    field.solid[name] = createStore(
      () => field.data[name],
      (cb) => field.eeSync.on(name, cb),
    );
  }

  field.solid.errorTouched = createStore(
    () => field.errorTouched,
    (cb) => field.eeSync.on('errorTouched', cb),
  );
}

export const addSolidPlugin = () => (form) => {
  transformForm(form);
};
