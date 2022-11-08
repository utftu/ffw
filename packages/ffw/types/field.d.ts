import {Emitter} from 'mitt';
import Form from './form';

declare class Field<TValue, TForm extends Form<Field<TValue, TForm>>> {
  constructor(props: {
    name: string;
    value: TValue;
    error: string;
    touched: boolean;
    form: TForm;
  });

  name: string;
  form: TForm;

  data: {
    value: TValue;
    error: string;
    touched: boolean;
    [name: string | number | symbol]: any;
  };

  emitter: Emitter<{
    value: TValue;
    error: string;
    touched: boolean;
    [name: string | number | symbol]: any;
  }>;

  get value(): TValue;
  set value(value: TValue);

  get error(): string;
  set error(error: string);

  get touched(): boolean;
  set touched(touched: boolean);

  setData(name: string, newData: TValue): void;
  setError(error: string): void;
  setTouched(touched: boolean): void;
  set(value: TValue, validate?: boolean): void;

  validate(): Promise<boolean>;
  subscribe(name: string, listener: (newData: TValue) => void): void;
  unsubscribe(name: string, listener: (newData: TValue) => void): void;
  onChange(event: {target: {value: string}}): void;
  onBlur(): void;
}

export default Field;
