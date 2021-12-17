import useForm from './use-form';
import {Field} from 'ffw';
import type {Config} from './use-unsub-form';

function useField(name: string, config?: Config): Field {
  const form = useForm(name, config);
  return form.fields[name];
}

export default useField;
