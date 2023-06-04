import {atom} from 'nanostores';

function createStore(get, subscribe) {
  const atomInstanse = atom(get());
  subscribe((value) => {
    atomInstanse.set(value);
  });
  return atomInstanse;
}

function transformField(field) {
  field.nanostores = {};

  for (const name in field.data) {
    field.nanostores[name] = createStore(
      () => field.data[name],
      (cb) => field.eeSync.on(name, cb)
    );
  }
  field.nanostores.errorTouched = createStore(
    () => field.errorTouched,
    (cb) => field.eeSync.on('errorTouched', cb)
  );
}

function transformForm(form) {
  form.nanostores = {};
  form.nanostores.createStore = createStore;
  form.nanostores.valid = createStore(
    () => form.valid,
    (cb) => form.eeSync.on('valid', cb)
  );

  const oldCreateField = form.createField;
  form.createField = function (...args) {
    const field = oldCreateField.call(form, ...args);
    transformField(field);
  };
}

export const addNanostores = () => (form) => {
  transformForm(form);
};
