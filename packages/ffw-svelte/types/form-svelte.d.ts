import type {Form} from 'packages/ffw';
import type FieldSvelte from './field-svelte';

type TTrackedReadable<TValue> = {
  subscribe: (cb: (data: TValue) => void) => void;
};

declare class FormSvelte<
  TField extends FieldSvelte<any, any, FormSvelte<TField>>
> extends Form<TField> {
  s: {
    valid: TTrackedReadable<boolean>;
  };
  svelte: {
    valid: TTrackedReadable<boolean>;
  };
}

export default FormSvelte;
