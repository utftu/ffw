import {createEventEmitter} from 'utftu';
import {Cb, Field, PropsField, Test} from '../field/field.js';

type Options = {
  validateOnChange: boolean;
  validateOnBlur: boolean;
  checkPrevData: boolean;
};

type OnSubmit = (form: Form) => void;

type FormProps = {
  plugins?: ((form: Form) => void)[];
  initValues?: Record<string, any>;
  options?: Partial<Options>;
  onSubmit?: OnSubmit;
  validateSchema?:
    | Record<string, Test>
    | ((form: Form) => Record<string, Test>);
};

const optionsDefault = {
  validateOnChange: true,
  validateOnBlur: true,
  checkPrevData: false,
};

export class Form {
  static new(props: FormProps) {
    return new Form(props);
  }

  options: {
    validateOnChange: boolean;
    validateOnBlur: boolean;
    checkPrevData: boolean;
  };
  initValues: Record<string, any>;
  fields: Record<string, Field<any>> = {};
  f: Record<string, Field<any>>;
  onSubmit: OnSubmit;
  eeSync = createEventEmitter();
  ee = createEventEmitter();

  notify(name: string, value: any) {
    this.ee.emit(name, value);
    if (name !== 'global') {
      this.notify('global', {form: this, name, value});
    }
  }

  createField(props: PropsField) {
    return new Field(props);
  }

  _getFlatFieldOrCreate(
    name: string,
    props: Omit<PropsField, 'name' | 'form'>,
  ) {
    if (!this.fields[name]) {
      this.fields[name] = this.createField({name, form: this, ...props});
    }
    return this.fields[name];
  }

  constructor(props: FormProps = {}) {
    const plugins = props.plugins || [];
    this.f = this.fields;

    plugins.forEach((plugin) => plugin(this));

    this.options = {...optionsDefault, ...props.options};
    this.onSubmit = props.onSubmit ?? ((_form) => {});
    this.initValues = props.initValues ?? {};

    for (const fieldName in this.initValues) {
      const defaultValue = this.initValues[fieldName];
      this._getFlatFieldOrCreate(fieldName, {
        value: defaultValue,
      });
    }

    const validateObj =
      typeof props.validateSchema === 'function'
        ? props.validateSchema(this)
        : props.validateSchema;

    for (const fieldName in validateObj) {
      const test = validateObj[fieldName];
      const field = this._getFlatFieldOrCreate(fieldName, {value: undefined});
      field.test = test;
    }
  }

  async validate() {
    const errors = await Promise.all(
      [...this._flatFields].map((field) => field.validate()),
    );

    return errors.every((error) => error === '');
  }

  getValid() {
    if (this._errors === 0) {
      return true;
    }
    return false;
  }

  get valid() {
    return this.getValid();
  }

  submit = async () => {
    const formValid = await this.validate();
    if (formValid) {
      return this.onSubmit(this);
    }
  };

  reset() {
    for (const field of this._flatFields) {
      field.reset();
    }
  }

  _prepareFieldData<TValue>(func: (field: Field) => TValue) {
    const data: Record<keyof typeof this.fields, any> = {};
    for (const key in this.fields) {
      const funcResult = func(this.fields[key]);
      if (funcResult === undefined) {
        continue;
      }
      data[key] = func(this.fields[key]);
    }
    return data;
  }

  get values() {
    return this._prepareFieldData((field) => field.value);
  }

  get errors() {
    return this._prepareFieldData((field) => field.error || undefined);
  }

  get touches() {
    return this._prepareFieldData((field) => field.touched || undefined);
  }

  get data() {
    return this._prepareFieldData((field) => ({
      value: field.value,
      error: field.error,
      touched: field.touched,
    }));
  }

  on(name: string, cb: Cb) {
    this.ee.on(name, cb);

    return () => this.ee.off(name, cb);
  }

  off(name: string, cb: Cb) {
    return () => this.ee.off(name, cb);
  }

  _errors = 0;
  _flatFields = new Set<Field>();
  addField(field: Field) {
    if (field.error !== '') {
      this._errors++;
    }
    this._flatFields.add(field);
  }
  removeField(field: Field) {
    if (field.error !== '') {
      this._errors--;
    }
    this._flatFields.delete(field);
  }
}
