import {useCallback} from 'react';
import {useForm} from '../use-form/use-form.ts';
import {useSubscribe} from '../use-subscribe/use-subscribe.ts';
import {FieldReact, FormReact} from '../plugin/plugin.ts';

type DepsArr = (string | FieldReact)[];
type Deps = DepsArr | ((form: FormReact) => DepsArr);

function prepareDeps(deps: Deps, form: FormReact): FieldReact[] {
  deps = typeof deps === 'function' ? deps(form) : deps;
  const fields = deps.map((dep) => {
    if (typeof dep === 'string') {
      return form.fields[dep];
    }
    return dep;
  });
  return fields;
}

export function useFields(deps: Deps = [], customForm?: FormReact) {
  const form = useForm(customForm);
  const fields = prepareDeps(deps, form);

  const get = useCallback(() => {
    return fields;
  }, fields);

  const subscribe = useCallback((listener: (fields: FieldReact[]) => void) => {
    fields.forEach((field) =>
      field.on('*', () => {
        listener(fields);
      }),
    );
    return () => {
      fields.forEach((field) => field.off('*', listener));
    };
  }, fields);

  const value = useSubscribe(get, subscribe);

  return value;
}

export function useFormProp(name: string, customForm: FormReact) {
  const form = useForm(customForm);

  const get = useCallback(() => {
    return form[name as keyof FormReact];
  }, [form]);

  const subscribe = useCallback(
    (listener: (fields: FormReact) => void) => {
      return form.ee.on(name, (value) => listener(value));
    },
    [form],
  );

  const value = useSubscribe(get, subscribe);

  return value;
}

export function useFieldProp(name: string, field: FieldReact) {
  const get = useCallback(() => {
    return field[name as keyof FieldReact];
  }, [field]);

  const subscribe = useCallback(
    (listener: (value: FieldReact) => void) => {
      return field.ee.on(name, (value) => listener(value));
    },
    [field],
  );

  const value = useSubscribe(get, subscribe);

  return value;
}
