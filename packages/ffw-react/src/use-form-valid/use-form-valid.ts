import {useCallback} from 'react';
import {useForm} from '../use-form/use-form.ts';
import {useSubscribe} from '../use-subscribe/use-subscribe.ts';
import {FormReact} from '../plugin/plugin.ts';
import {useFormProps} from '../use-form-props/use-form-props.ts';

export function useFormValid(customForm?: FormReact) {
  const [valid] = useFormProps(['valid'], customForm);
  return valid;
}
