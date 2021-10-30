import useForm from './use-form';
import type Field from './field';
import type {Config} from './use-unsub-form.js';

function useField(name: string, config?: Config): Field {
  const form = useForm(name, config);
  return form.fields[name];
}

export default useField;
