import {Field, Form} from 'ffw';
import createStore from '../create-store/create-store.ts';
import {Accessor} from 'solid-js';

type CustomStore = Record<string, Accessor<any>>;

export type FieldSolid<TValue = any> = Field<TValue> & {
  solid: {
    value: Accessor<TValue>;
    error: Accessor<string>;
    touched: Accessor<boolean>;
    errorTouched: Accessor<string>;
    custom: CustomStore;
  };
};

export type FormSolid = Form<FieldSolid> & {
  solid: {
    createStore: typeof createStore;
    valid: Accessor<boolean>;
    custom: CustomStore;
  };
};

function transformField(field: Field) {
  const fieldSolid = field as FieldSolid;
  fieldSolid.solid = {
    custom: {},
  } as typeof fieldSolid.solid;

  for (const name of ['touched', 'error', 'errorTouched', 'value'] as const) {
    fieldSolid.solid[name] = createStore(
      () => field[name],
      (cb) => field.ee.on(name, cb),
    );
  }

  return fieldSolid;
}

function transformForm(form: Form) {
  const formSolid = form as FormSolid;
  formSolid.solid = {
    createStore,
    valid: createStore(
      () => form.valid,
      (cb) => form.ee.on('valid', cb),
    ),
    custom: {},
  };

  const oldCreateField = form.createField;
  form.createField = function (...args) {
    const field = oldCreateField.call(form, ...args);
    return transformField(field);
  };

  for (const key in form.fields) {
    const field = form.fields[key];
    transformField(field);
  }

  return formSolid;
}

export const addSolidPlugin = () => (form: Form) => {
  return transformForm(form);
};
