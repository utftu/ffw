import type FormSvelte from './form-svelte';
import type FieldSvelte from './field-svelte';

export type initFFw<TForm extends FormSvelte<FieldSvelte<any, any, TForm>>> =
  () => TForm;
export type getFfw = <TValue>() => FormSvelte<FieldSvelte<TValue, string, any>>;
export type setFfwContext = () => void;
export type getFfwContext = <T>() => T;
