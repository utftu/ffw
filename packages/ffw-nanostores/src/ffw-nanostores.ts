import {atom} from 'nanostores';
import {Field, Form} from 'ffw';

type FieldNanostores<TValue = any> = Field<TValue> & {
  nanostores: any;
};

type FormNanostores = Form<FieldNanostores> & {
  nanostores: any;
};

type Get<TValue = any> = () => TValue;
type Cb<TValue = any> = (value: TValue) => void;
type Subscribe<TValue = any> = (cb: Cb<TValue>) => void;

function createStore(get: Get, subscribe: Subscribe) {
  const atomInstanse = atom(get());
  subscribe((value) => {
    atomInstanse.set(value);
  });
  return atomInstanse;
}

function transformField(field: Field) {
  const fieldNanostores = field as FieldNanostores;
  fieldNanostores.nanostores = {};

  for (const name in field.data) {
    fieldNanostores.nanostores[name] = createStore(
      () => field.data[name],
      (cb) => field.ee.on(name, cb),
    );
  }
  fieldNanostores.nanostores.errorTouched = createStore(
    () => field.errorTouched,
    (cb) => field.ee.on('errorTouched', cb),
  );
}

function transformForm(form: Form) {
  const formNanostores = form as FormNanostores;
  formNanostores.nanostores = {} as any;
  formNanostores.nanostores.createStore = createStore;
  formNanostores.nanostores.valid = createStore(
    () => form.valid,
    (cb) => form.ee.on('valid', cb),
  );

  const oldCreateField = form.createField;
  form.createField = function (...args) {
    const field = oldCreateField.call(form, ...args);
    transformField(field);
    return field;
  };
}

export const addNanostores = () => (form: Form) => {
  transformForm(form);
};
