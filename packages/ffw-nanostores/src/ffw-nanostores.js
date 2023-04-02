import {atom} from 'nanostores';

function createStore(name, value, ee) {
  const atomInstanse = atom(value);
  ee.on(name, (newValue) => atom.set(newValue));

  return atomInstanse;
}

function transformField(field) {
  field.nanostores = {};
  field.nanostores.makeStore = (name, value) => {
    field.nanostores[name] = createStore(name, value, field.ee);
  };

  for (const name in field.data) {
    field.nanostores.makeStore(name, data[name]);
  }
  field.nanostores.makeStore('errorTouched', field.errorTouched);
  field.nanostores.makeStore('global', null);
}

function transformForm(form) {
  form.nanostores = {};
  form.nanostores.makeStore = (name, value) => {
    form.nanostores[name] = createStore(name, value, form.ee);
  };
  form.nanostores.makeStore('valid', form.valid);
  form.nanostores.makeStore('global', null);

  const oldCreateField = form.createField;
  form.createField = function (...args) {
    const field = oldCreateField.call(form, ...args);
    transformField(field);
  };
}

export function addNanostores(form) {
  transformForm(form);
}
