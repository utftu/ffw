import useForm from './use-form';

function useField(name, config) {
  const form = useForm(name, config);
  return form.fields[name];
}

export default useField;
