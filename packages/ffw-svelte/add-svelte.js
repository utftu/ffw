function makeReadStore(svelte, ee, name, value) {
  svelte[name] = {
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

function makeWriteStore(svelte, ee, name, value, set) {
  makeReadStore(svelte, ee, name, value);
  svelte[name].set = set;
}

function transformForm(form) {
  form.svelte = {};
  form.svelte.makeReadStore = (name, value) =>
    makeReadStore(form.svelte, form.ee, name, value);
  form.svelte.makeReadStore('valid', form.valid);
  form.svelte.makeReadStore('global', null);

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
