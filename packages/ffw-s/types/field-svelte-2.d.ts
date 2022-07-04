import type {Form} from 'ffw-base';
import {Field} from "ffw-base";

type Store<TName extends keyof Form['_fields'], TDataName extends keyof Form['_fields'][TName]> = {
  set(data: Form['_fields'][TName]['data'][TDataName]);
  subscribe(cb: (data: Form['_fields'][TName][TDataName]) => () => void);
};

type Svelte<TName extends keyof Form['_fields']> = {
  makeStore<TDataName extends keyof Form['_fields'][TName]>(name: TDataName): Store<TName, TDataName>;
  subscribe<TValueName extends keyof TForm['_fields'][TName]>(
    cb: (name: keyof TForm['_fields'][TName]['data'], data: TForm['_fields'][TName][TValueName]) => void
  ): () => void;
  value: Store<'value'>;
  error: Store<'error'>;
  touched: Store<'touched'>;
};

declare class FieldSvelte<
  TValue,
  TName extends keyof Form<FieldSvelte<TValue, TName>>,
> extends Field<TValue> {
  svelte: Svelte<TName, TForm>;
  s: Svelte<TName, TForm>;
}

export default FieldSvelte;
