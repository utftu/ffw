import {useCallback} from 'react';
import {FormReact} from '../plugin/plugin.ts';
import {useForm} from '../use-form/use-form.ts';
import {useSubscribe} from '../use-subscribe/use-subscribe.ts';

export function useFormGloabal(customForm?: FormReact) {
  const form = useForm(customForm);

  const get = useCallback(() => {
    return form;
  }, [form]);

  const subscribe = useCallback(
    (listener: (fields: FormReact) => void) => {
      return form.ee.on('global', () => listener(form));
    },
    [form],
  );

  return useSubscribe(get, subscribe);
}
