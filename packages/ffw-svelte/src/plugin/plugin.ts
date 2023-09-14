import {Field, Form} from 'ffw';

type Get<TValue = any> = () => TValue;
type Set<TValue = any> = (value: TValue) => void;
type Cb<TValue = any> = (value: TValue) => void;
type Subscribe<TValue = any> = (cb: Cb<TValue>) => void;

type ReadStore<TValue = any> = {
  subscribe: Subscribe<TValue>;
};

type WriteStore<TValue = any> = ReadStore<TValue> & {
  set: Set<TValue>;
};

type AnyStore = ReadStore<any> | WriteStore<any>;

export type FieldFfwSvelte<TValue = any> = Field<TValue> & {
  svelte: {
    value: WriteStore<TValue>;
    touched: WriteStore<boolean>;
    error: ReadStore<string>;
    errorTouched: ReadStore<string>;
    custom: Record<string, AnyStore>;
  };
};

export type FormFfwSvelte = Form<FieldFfwSvelte> & {
  svelte: {
    valid: ReadStore<boolean>;
    createReadStore: typeof createReadStore;
    createWriteStore: typeof createWriteStore;
    custom: Record<string, AnyStore>;
  };
};

function createReadStore<TValue = any>(
  get: Get,
  subscribe: Subscribe,
): ReadStore<TValue> {
  return {
    subscribe(cb: Cb) {
      cb(get());

      return subscribe(cb);
    },
  };
}

function createWriteStore(get: Get, subscribe: Subscribe, set: Set) {
  const store: WriteStore = createReadStore(get, subscribe) as WriteStore;
  store.set = set;
  return store;
}

function transformField(field: Field) {
  const fieldSvelte = field as FieldFfwSvelte;
  fieldSvelte.svelte = {} as typeof fieldSvelte.svelte;

  for (const name of ['value', 'touched'] as const) {
    fieldSvelte.svelte[name] = createWriteStore(
      () => field.data[name],
      (cb) => field.ee.on(name, cb),
      (data) => {
        field.setData(name, data);
      },
    );
  }

  for (const name of ['error', 'errorTouched'] as const) {
    fieldSvelte.svelte[name] = createReadStore(
      () => field[name],
      (cb) => field.ee.on(name, cb),
    );
  }

  return fieldSvelte;
}

function transformForm(form: Form) {
  const formSvelte = form as FormFfwSvelte;
  formSvelte.svelte = {
    createReadStore,
    createWriteStore,
    valid: createReadStore(
      () => form.valid,
      (cb) => form.ee.on('valid', cb),
    ),
  } as typeof formSvelte.svelte;

  const oldCreateField = form.createField;
  form.createField = function (...args) {
    const field = oldCreateField.call(form, ...args);
    return transformField(field);
  };

  for (const key in form.fields) {
    const field = form.fields[key];
    transformField(field);
  }

  return formSvelte;
}

export const addSveltePlugin = () => (form: Form) => {
  return transformForm(form);
};
