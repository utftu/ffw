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
    const ubsubscribeFuncs = fields.map((field) =>
      field.ee.on('global', () => listener(fields)),
    );

    return () => ubsubscribeFuncs.forEach((unsubscribe) => unsubscribe());
  }, fields);

  const value = useSubscribe(get, subscribe);

  return value;
}
