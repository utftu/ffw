function createReadStore(name, value, ee) {
  return {
    subscribe(cb) {
      cb(value);

      const listener = (value) => cb(value);
      ee.on(name, listener);

      return () => {
        ee.off(name, listener);
      };
    },
  };
}

function createWriteStore(name, value, ee, set) {
  const store = createReadStore(name, value, ee);
  store.set = set;
  return store;
}

function transformField(field) {
  field.svelte = {};
  field.svelte.makeWriteStore = (name, value) => {
    field.svelte[name] = createWriteStore(name, value, field.ee, (value) => {
      field.setData(name, value);
    });
  };

  for (const name in field.data) {
    field.svelte.makeWriteStore(name, field.data[name]);
  }

  field.svelte.errorTouched = createReadStore(
    'errorTouched',
    field.errorTouched,
    field.ee
  );
  field.svelte.global = createReadStore('global', null, field.ee);
}

function transformForm(form) {
  form.svelte = {};
  form.svelte.makeReadStore = (name, value) => {
    form.svelte[name] = createReadStore(name, value, form.ee);
  };
  form.svelte.makeReadStore('valid', form.valid);
  form.svelte.makeReadStore('global', null);

  const oldCreateField = form.createField;
  form.createField = function (...args) {
    const field = oldCreateField.call(form, ...args);
    transformField(field);
    return field;
  };
}

export function addSvelte(form) {
  transformForm(form);
}

export default addSvelte;
