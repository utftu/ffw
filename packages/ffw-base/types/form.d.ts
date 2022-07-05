import type DelayedCalls from './delayd-calls';
import type Field from './field';
import type {BaseSchema} from 'yup';

declare class Form<TField extends Field<any>> {
  constructor(props: {
    validateSchema?: BaseSchema;
    onSubmit?: (form: Form<TField>) => void;
    initValues?: Record<string, any>;
    initData?: Record<string, any>;
    batch?: (cb: () => void) => void;
    createField: (name: string) => TField;
    options: {
      validateOnChange: boolean;
      validateOnBlur: boolean;
      validateOnMount: boolean;
      checkPrevData: boolean;
    };
  });
  options: {
    validateOnChange: boolean;
    validateOnBlur: boolean;
    validateOnMount: boolean;
    checkPrevData: boolean;
  };
  _fields: Record<string, TField>;
  fields: this['_fields'];
  f: this['_fields'];
  calls: DelayedCalls;
  validateSchema: any;
  addField<TValue>(name: string, field: Field<TValue>): void;
  createField<TValue>(name: string): Field<TValue>;
  getField<TName extends keyof this['_fields']>(
    name: TName
  ): this['_fields'][TName];
  onSubmit(form: this): void;
  batch(): void;
  getFields(): this['_fields'];
  iterateFields(cb: (field: TField) => void): void;
  addGlobalListener(
    listener: (field: TField, dataName: string, data: any) => void
  ): void;
  reset(): void;
  setValue(
    name: keyof this['_fields'] | string,
    value: keyof this['_fields'][typeof name]
  ): void;
  setTouched(name: keyof this['_fields'] | string, touched: boolean): void;
  setError(name: keyof this['_fields'] | string, error: string): void;
  setValues(values: Record<string, any>): void;
  setErrors(errors: Record<string, string>): void;
  setTouches(touches: Record<string, boolean>): void;
  getValues(): Record<
    keyof this['_fields'],
    {[Property in keyof this['_fields']]: this['_fields'][Property]['value']}
  >;
  getErrors(): Record<keyof this['_fields'], string>;
  getTouches(): Record<keyof this['_fields'], boolean>;
  get values(): Record<keyof this['_fields'], ReturnType<this['getValues']>>;
  get errors(): Record<keyof this['_fields'], string>;
  get touches(): Record<keyof this['_fields'], boolean>;
}

export default Form;

declare class Box<Type> {
  contents: Type;
}
