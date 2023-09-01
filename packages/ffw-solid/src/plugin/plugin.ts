import {Field, Form} from 'ffw';
import createStore from '../create-store/create-store.ts';
import {Accessor} from 'solid-js';

export type FieldSolid<TValue = any> = Field<TValue> & {
  solid: {
    value: Accessor<TValue>;
    error: Accessor<string>;
    touched: Accessor<boolean>;
    errorTouched: Accessor<boolean>;
    [key: string]: Accessor<any>;
  };
};

export type FormSolid = Form<FieldSolid> & {
  solid: {
    createStore: typeof createStore;
    valid: Accessor<boolean>;
  } & {[key: string]: Accessor<any>};
};

function transformField(field: Field) {
  const fieldSolid = field as FieldSolid;
  fieldSolid.solid = {} as typeof fieldSolid.solid;

  for (const name in field.data) {
    fieldSolid.solid[name] = createStore(
      () => field.data[name],
      (cb) => field.ee.on(name, cb),
    );
  }

  fieldSolid.solid.errorTouched = createStore(
    () => field.errorTouched,
    (cb) => field.ee.on('errorTouched', cb),
  );
}

function transformForm(form: Form) {
  const formSolid = form as FormSolid;
  formSolid.solid = {
    createStore,
    valid: createStore(
      () => form.valid,
      (cb) => form.ee.on('valid', cb),
    ),
  };

  const oldCreateField = form.createField;
  form.createField = function (...args) {
    const field = oldCreateField.call(form, ...args);
    transformField(field);
    return field;
  };
}

export const addSolidPlugin = () => (form: Form) => {
  transformForm(form);
};
