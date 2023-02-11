import {atom} from 'nanostores';

function addNanostores(form) {
  transformForm(form);
}

function makeStore(nanostores, ee, name, value) {
  nanostores[name] = atom(value);
  ee.on(name, (newValue) => field.nanostores[name].set(newValue));
}

function transformForm(form) {
  form.nanostores = {};
  form.nanostores.makeStore = (name, value) =>
    makeStore(form.nanostores, form.ee, name, value);
  form.nanostores.makeStore('valid', form.valid);
  form.nanostores.makeStore('global', null);

  const oldCreateField = form.createField;
  form.createField = function (...args) {
    const field = oldCreateField.call(form, ...args);
    transformField(field);
  };
}

function transformField(field) {
  field.nanostores = {};
  field.nanostores.makeStore = (name, value) =>
    makeStore(field.nanostores, field.ee, name, value);

  for (const name in data) {
    field.nanostores.makeStore(name, data[name]);
  }
  field.nanostores.makeStore('errorTouched', field.errorTouched);
  field.nanostores.makeStore('global', null);
}
