import {useCallback} from 'react';
import {useForm} from '../use-form/use-form.ts';
import {useSubscribe} from '../use-subscribe/use-subscribe.ts';
import {FormReact} from '../plugin/plugin.ts';

export function useFormValid(customForm?: FormReact) {
  const form = useForm(customForm);

  const subscribe = useCallback(
    (listener: (_: any) => void) => {
      return form.on('valid', listener);
    },
    [form],
  );

  const get = useCallback(() => {
    return form.getValid();
  }, [form]);

  const value = useSubscribe(get, subscribe);

  return value;
}
