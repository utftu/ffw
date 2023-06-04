function createReadStore(get, subscribe) {
  return {
    subscribe(cb) {
      cb(get());

      return subscribe(cb);
    },
  };
}

function createWriteStore(get, subscribe, set) {
  const store = createReadStore(get, subscribe);
  store.set = set;
  return store;
}

function transformField(field) {
  field.svelte = {};

  for (const name in field.data) {
    field.svelte[name] = createWriteStore(
      () => field.data[name],
      (cb) => field.eeSync.on(name, cb),
      (data) => {
        field.setData(name, data);
      }
    );
  }
  field.svelte.value = createWriteStore(
    () => field.data.value,
    (cb) => field.eeSync.on('value', cb),
    (data) => {
      field.set(data);
    }
  );

  field.svelte.errorTouched = createReadStore(
    () => field.errorTouched,
    (cb) => field.eeSync.on('errorTouched', cb)
  );
}

function transformForm(form) {
  form.svelte = {};
  form.svelte.createReadStore = createReadStore;
  form.svelte.createWriteStore = createWriteStore;
  form.svelte.valid = createReadStore(
    () => form.valid,
    (cb) => form.eeSync.on('valid', cb)
  );

  const oldCreateField = form.createField;
  form.createField = function (...args) {
    const field = oldCreateField.call(form, ...args);
    transformField(field);
    return field;
  };
}

export const addSveltePlugin = () => (form) => {
  transformForm(form);
};
