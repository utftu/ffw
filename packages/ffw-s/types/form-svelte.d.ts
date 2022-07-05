import type {Form} from 'ffw-base';
import type FieldSvelte from './field-svelte';

type TTrackedReadable = {
  subscribe: <TValue>(cb: (data: TValue) => void) => void;
};

declare class FormSvelte<
  TField extends FieldSvelte<any, string, FormSvelte<any>>
> extends Form<any> {
  s: {
    valid: TTrackedReadable;
  };
  svelte: {
    valid: TTrackedReadable;
  };
}

export default FormSvelte;
