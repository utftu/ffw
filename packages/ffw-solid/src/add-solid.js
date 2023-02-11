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
    form.solid[name] = createStore(name, value, ee);
  };
  form.svelte.makeStore('valid', form.valid);
  form.svelte.makeStore('global', null);

  const oldCreateField = form.createField;
  form.createField = function (...args) {
    const field = oldCreateField.call(form, ...args);
    transformField(field);
  };
}

function transformField(field) {
  field.svelte = {};
  field.svelte.makeWriteStore = (name, value) =>
    makeReadStore(field.svelte, field.ee, name, value, () =>
      field.setData(name, value)
    );

  for (const name in data) {
    field.nanostores.makeWriteStore(name, data[name]);
  }
  field.svelte.errorTouched = makeWriteStore(
    field.svelte,
    field.ee,
    'errorTouched',
    field.errorTouched
  );
  field.svelte.global = makeWriteStore(field.svelte, field.ee, 'global', null);
}
