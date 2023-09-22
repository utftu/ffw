import {useCallback} from 'react';
import {FieldReact, FormReact} from '../plugin/plugin.ts';
import {useSubscribe} from '../use-subscribe/use-subscribe.ts';
import {useForm} from '../use-form/use-form.ts';

export function useFieldProps(
  names: string[],
  customField: FieldReact | string,
  customForm?: FormReact,
) {
  const form = useForm(customForm);
  const field =
    typeof customField === 'string' ? form.fields[customField] : customField;

  const get = useCallback(() => {
    return names.map((name) => field[name as keyof FieldReact]);
  }, [field, ...names]);

  const subscribe = useCallback(
    (listener: (value: any[]) => void) => {
      const unsubscribeFuncs = names.map((name) =>
        field.ee.on(name, () => listener(get())),
      );

      return () => unsubscribeFuncs.forEach((unsubscribe) => unsubscribe());
    },
    [field, ...names],
  );

  return useSubscribe(get, subscribe);
}
