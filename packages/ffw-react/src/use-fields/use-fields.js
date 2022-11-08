import {useCallback, useSyncExternalStore} from 'react';
import useForm from '../use-form/use-form.js';

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

function useFields(deps, customForm) {
  const form = useForm(customForm);
  const fields = prepareDeps(deps, form);

  const subscribe = useCallback((listener) => {
    fields.forEach((field) => {
      field.on('*', listener);
    });
    return () => {
      fields.forEach((field) => {
        field.off('*', listener);
      });
    };
  }, fields);

  const get = useCallback(() => {
    return fields;
  }, fields);

  return useSyncExternalStore(subscribe, get, get);
}

export default useFields;
