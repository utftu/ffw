import {useCallback} from 'react';
import {useForm} from '../use-form/use-form.js';
import {useSubscribe} from '../use-subscribe/use-subscribe.js';

function prepareDeps(deps, form) {
  deps = typeof deps === 'function' ? deps(form) : deps;
  deps = deps.map((dep) => {
    if (typeof dep === 'string') {
      return form.fields[dep];
    }
    return dep;
  });
  return deps;
}

export function useFields(deps = [], customForm) {
  const form = useForm(customForm);
  const fields = prepareDeps(deps, form);

  const get = useCallback(() => {
    return fields;
  }, fields);

  const subscribe = useCallback((listener) => {
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
