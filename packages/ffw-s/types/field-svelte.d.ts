import type {Form} from 'ffw-base';

type Store<TName extends keyof TForm['_fields'], TForm extends Form = Form> = {
  set(data: TForm['_fields'][TName]);
  subscribe(cb: (data: TForm['_fields'][TName]) => () => void);
};

type Svelte<TName extends keyof TForm['_fields'], TForm extends Form = Form> = {
  makeStore(name: TName): Store<TName>;
  subscribe<TValueName extends keyof TForm['_fields'][TName]>(
    cb: (name: keyof TForm['_fields'][TName]['data'], data: TForm['_fields'][TName][TValueName]) => void
  ): () => void;
  value: Store<'value'>;
  error: Store<'error'>;
  touched: Store<'touched'>;
};

declare class FieldSvelte<
  TName extends keyof TForm = any,
  TForm extends Form = Form
> {
  svelte: Svelte<TName, TForm>;
  s: Svelte<TName, TForm>;
}

export default FieldSvelte;
