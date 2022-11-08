import useFormOld from './use-form-old.js';
import {useSyncExternalStore} from 'react';

function useField(name, config) {
  const form = useFormOld(name, config);
  return form.fields[name];

  return useSyncExternalStore();
}

export default useField;
