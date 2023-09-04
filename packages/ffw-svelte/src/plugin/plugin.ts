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

export type FieldFfwSvelte<TValue = any> = Field<TValue> & {
  svelte: {
    value: WriteStore<TValue>;
    error: WriteStore<string>;
    touched: WriteStore<boolean>;
    errorTouched: ReadStore<boolean>;
  } & {[key: string]: WriteStore<any>};
};

export type FormFfwSvelte = Form<FieldFfwSvelte> & {
  svelte: {
    valid: ReadStore<boolean>;
    createReadStore: typeof createReadStore;
    createWriteStore: typeof createWriteStore;
  } & {[key: string]: WriteStore<any>};
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
  fieldSvelte.svelte = {} as any;

  for (const name in field.data) {
    fieldSvelte.svelte[name] = createWriteStore(
      () => field.data[name],
      (cb) => field.ee.on(name, cb),
      (data) => {
        field.setData(name, data);
      },
    );
  }
  fieldSvelte.svelte.value = createWriteStore(
    () => field.data.value,
    (cb) => field.ee.on('value', cb),
    (data) => {
      field.set(data);
    },
  );

  fieldSvelte.svelte.errorTouched = createReadStore(
    () => field.errorTouched,
    (cb) => field.ee.on('errorTouched', cb),
  );
}

function transformForm(form: Form) {
  const formSvelte = form as FormFfwSvelte;
  formSvelte.svelte = {} as any;
  formSvelte.svelte.createReadStore = createReadStore;
  formSvelte.svelte.createWriteStore = createWriteStore;
  formSvelte.svelte.valid = createReadStore(
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

export const addSveltePlugin = () => (form: Form) => {
  transformForm(form);
};
