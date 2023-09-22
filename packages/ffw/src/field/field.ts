import {createEventEmitter} from 'utftu';
import {Form} from '../form/form.ts';

const defaultTest = () => '';

export type Cb<TValue = any> = (value: TValue) => void;
export type UnsubscribeCb = () => void;

type Data<TValue> = {
  value: TValue;
  touched: boolean;
  error: string;
  [key: string]: any;
};

export type Test<TValue = any> = (value: TValue) => string;

export type PropsField<TValue = any> = {
  value?: TValue;
  test?: Test<TValue>;
  touched?: boolean;
  error?: string;
  form: Form;
  name?: string;
};

type InitParams<TValue> = Data<TValue> & {
  test: Test<TValue>;
};

export class Field<TValue = any> {
  valueType!: TValue;

  static new<TValue = string>(props: PropsField<TValue>) {
    return new Field(props);
  }

  form: Form;
  name: string;

  ee = createEventEmitter();
  // ee = createEventEmitter();

  notify(name: string, value: any) {
    this.ee.emit(name, value);
    if (name !== 'global') {
      this.notify('global', {name, value});
    }
    this.form.notify('global', {field: this, name, value});
  }

  data: Data<TValue>;
  initParams: InitParams<TValue>;
  test: Test<TValue>;

  constructor({
    value = '' as TValue,
    touched = false,
    error = '',
    test = defaultTest,
    name = '',
    form,
  }: PropsField<TValue>) {
    this.form = form;
    this.test = test;
    this.name = name;

    this.initParams = {
      value,
      touched,
      error,
      test,
    };

    this.data = {
      value,
      error,
      touched,
    };

    form.addField(this);
  }

  get value() {
    return this.data.value;
  }

  set value(newValue) {
    this.set(newValue);
  }

  get error() {
    return this.data.error;
  }

  set error(newError) {
    this.setError(newError);
  }

  get touched() {
    return this.data.touched;
  }

  set touched(newTouched) {
    this.setTouched(newTouched);
  }

  get errorTouched() {
    if (this.data.touched === false) {
      return '';
    }
    return this.data.error;
  }

  setData(name: string, newData: any) {
    const prevData = this.data[name];
    if (this.form.options.checkPrevData && prevData === newData) {
      return false;
    }
    const oldErrorTouched = this.errorTouched;
    this.data[name] = newData;

    this.notify(name, newData);

    if (name === 'error') {
      const oldError = prevData;
      const error = newData;
      if (error !== '' && oldError === '') {
        this.form._errors++;
        if (this.form._errors === 1) {
          this.form.notify('valid', false);
        }
      } else if (error === '' && oldError !== '') {
        this.form._errors--;
        if (this.form._errors === 0) {
          this.form.notify('valid', true);
        }
      }
    }

    if (name === 'error' || name === 'touched') {
      if (oldErrorTouched !== this.errorTouched) {
        this.notify('errorTouched', this.errorTouched);
      }
    }

    return true;
  }

  update() {
    this.notify('*', undefined);
  }

  setError(error: string) {
    this.setData('error', error);
  }

  setTouched(touched: boolean) {
    this.setData('touched', touched);
  }

  set = (value: TValue, validate?: boolean) => {
    this.setData('value', value);

    if (validate === true) {
      this.validate();
      return;
    }

    if (validate === false) {
      return;
    }

    if (validate === undefined && this.form.options.validateOnChange) {
      this.validate();
    }
  };

  validate() {
    const error = this.test(this.data.value);

    this.setError(error);

    return error;
  }

  on(name: string, cb: Cb<TValue>) {
    this.ee.on(name, cb);

    return () => this.ee.off(name, cb);
  }

  off(name: string, cb: Cb<TValue>) {
    return () => this.ee.off(name, cb);
  }

  onNativeInput = (event: {target: {value: TValue}}) => {
    this.set(event.target.value);
  };

  onBlur = () => {
    this.setTouched(true);

    if (this.form.options.validateOnBlur) {
      this.validate();
    }
  };

  reset() {
    this.setData('value', this.initParams.value);
    this.setData('touched', this.initParams.touched);
    this.setData('error', this.initParams.error);
  }
}
