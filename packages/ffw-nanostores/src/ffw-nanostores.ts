import {atom, type ReadableAtom} from 'nanostores';
import {Field, Form} from 'ffw';

type CustomStore = Record<string, ReadableAtom<any>>;

type FieldNanostores<TValue = any> = Field<TValue> & {
  nanostores: {
    value: ReadableAtom<TValue>;
    error: ReadableAtom<string>;
    errorTouched: ReadableAtom<string>;
    touched: ReadableAtom<boolean>;
    custom: Record<string, ReadableAtom<any>>;
  };
};

type FormNanostores = Form<FieldNanostores> & {
  nanostores: {
    createStore: typeof createStore;
    valid: ReadableAtom<boolean>;
    custom: CustomStore;
  };
};

type Get<TValue = any> = () => TValue;
type Cb<TValue = any> = (value: TValue) => void;
type Subscribe<TValue = any> = (cb: Cb<TValue>) => void;

function createStore(get: Get, subscribe: Subscribe) {
  const atomInstanse = atom(get());
  subscribe((value) => {
    atomInstanse.set(value);
  });
  return atomInstanse as ReadableAtom;
}

function transformField<TValue = any>(field: Field<TValue>) {
  const fieldNanostores = field as FieldNanostores<TValue>;
  fieldNanostores.nanostores = {} as typeof fieldNanostores.nanostores;

  for (const name of ['value', 'error', 'errorTouched', 'touched'] as const) {
    fieldNanostores.nanostores[name] = createStore(
      () => field[name],
      (cb) => field.ee.on(name, cb),
    );
  }

  return fieldNanostores;
}

function transformForm(form: Form) {
  const formNanostores = form as FormNanostores;
  formNanostores.nanostores = {
    createStore,
    valid: createStore(
      () => form.valid,
      (cb) => form.ee.on('valid', cb),
    ),
    custom: {},
  } as typeof formNanostores.nanostores;

  const oldCreateField = form.createField;
  form.createField = function (...args) {
    const field = oldCreateField.call(form, ...args);
    return transformField(field);
  };

  for (const key in form.fields) {
    const field = form.fields[key];

    transformField(field);
  }

  return formNanostores;
}

export const addNanostores = () => (form: Form) => {
  return transformForm(form);
};
