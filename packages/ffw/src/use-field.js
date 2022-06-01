import useForm from './use-form';
import {Field} from 'ffw-base';

function useField(name, config) {
  const form = useForm(name, config);
  return form.fields[name];
}

export default useField;
