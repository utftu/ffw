import type {Emitter} from 'mitt'

declare class Field<TValue = string> {
  name: string;
  form: Form;
  emitter: Emitter<any>;

  get value(): TValue;
  set value(value: TValue);

  get error(): string;
  set error(error: string);

  get touched(): boolean;
  set touched(touched: boolean);

  setData(name: string, newData: any): void;
  setError(error: string): void;
  setTouched(touched: boolean): void;
  set(value: TValue): void;

  validate(): Promise<boolean>;
  subscribe(name: string, listener: (newData: any) => void): void
  unsubscribe(name: string, listener: (newData: any) => void): void
  onChange(event: {target: {value: string}}): void;
  onBlur(): void;
}

declare class DelayedCalls {
  constructor(batch: () => void);
  changes: Record<string, () => void>;
  promise: Promise<void>;
  addCall(name: string, callback: () => void): void;
  handleChanges(): void;
}

declare class Form {
  options: {
    validateOnChange: boolean,
    validateOnBlur: boolean,
    validateOnMount: boolean,
    checkPrevData: boolean,
  };
  _fields: Record<string, Field<any>>;
  fields: this['_fields'];
  f: this['_fields'];
  calls: DelayedCalls
  validateSchema: any;
  addField<TValue>(name: string, field: Field<TValue>): void
  createField<TName extends keyof this['_fields']>(name: TName): this['_fields'][TName]
  getField<TName extends keyof this['_fields']>(name: TName): this['_fields'][TName]
  onSubmit(form: Form): void;
  batch(): void;
  getFields(): Form['_fields'];
  iterateFields(cb: (field: Field<any>) => void): void;
  addGlobalListener(listener: (field: Field, dataName: string, data: any) => void): void
  reset(): void;
  setValue(name: keyof this['_fields'] | string, value: keyof this['_fields'][typeof name]): void
  setTouched(name: keyof this['_fields'] | string, touched: boolean): void;
  setError(name: keyof this['_fields'] | string, error: string): void;
  setValues(values: Record<string, any>): void;
  setErrors(errors: Record<string, string>): void;
  setTouches(touches: Record<string, boolean>): void
  getValues():
    Record<
      keyof this['_fields'],
      { [Property in keyof this['_fields']]: this['_fields'][Property]['value'] }
    >
  getErrors(): Record<keyof this['_fields'], string>;
  getTouches(): Record<keyof this['_fields'], boolean>
  get values(): Record<keyof this['_fields'], ReturnType<this['getValues']>>
  get errors(): Record<keyof this['_fields'], string>;
  get touches(): Record<keyof this['_fields'], boolean>
}