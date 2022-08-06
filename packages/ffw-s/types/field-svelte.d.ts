import type {Form, Field} from 'ffw-base';
import type FormSvelte from './form-svelte';

type Store<
  TValue,
  TName extends keyof TForm['_fields'],
  TForm extends FormSvelte<FieldSvelte<TValue, TName, TForm>>,
  TDataName extends keyof TForm['_fields'][TName]['data']
> = {
  set(data: TForm['_fields'][TName]['data'][TDataName]);
  subscribe(
    cb: (data: TForm['_fields'][TName]['data'][TDataName]) => () => void
  );
};

type Svelte<
  TValue,
  TName extends keyof TForm['_fields'],
  TForm extends FormSvelte<FieldSvelte<TValue, TName, TForm>>
> = {
  makeStore<TDataName extends keyof TForm['_fields'][TName]['data']>(
    name: TDataName
  ): Store<TValue, TName, TForm, TDataName>;
  subscribe<TValueName extends keyof TForm['_fields'][TName]['data']>(
    cb: (
      // todo check types
      name: keyof TForm['_fields'][TName]['data'] | string | number | symbol,
      data: TForm['_fields'][TName]['data'][TValueName]
    ) => void
  ): () => void;
  value: Store<TValue, TName, TForm, 'value'>;
  error: Store<TValue, TName, TForm, 'error'>;
  touched: Store<TValue, TName, TForm, 'touched'>;
};

declare class FieldSvelte<
  TValue,
  TName extends keyof TForm['_fields'],
  TForm extends FormSvelte<FieldSvelte<TValue, TName, TForm>>
> extends Field<TValue, TForm> {
  svelte: Svelte<TValue, TName, TForm>;
  s: Svelte<TValue, TName, TForm>;
}

export default FieldSvelte;
