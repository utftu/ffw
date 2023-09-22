import {useCallback} from 'react';
import {FormReact} from '../plugin/plugin.ts';
import {useForm} from '../use-form/use-form.ts';
import {useSubscribe} from '../use-subscribe/use-subscribe.ts';

export function useFormProps(names: string[], customForm?: FormReact) {
  const form = useForm(customForm);

  const get = useCallback(() => {
    return names.map((name) => form[name as keyof FormReact]);
  }, [form, ...names]);

  const subscribe = useCallback(
    (listener: (value: any[]) => void) => {
      const unsubscribeFuncs = names.map((name) =>
        form.ee.on(name, () => listener(get())),
      );
      return () => unsubscribeFuncs.forEach((unsubscribe) => unsubscribe());
    },
    [form, ...names],
  );

  const value = useSubscribe(get, subscribe);

  return value;
}
