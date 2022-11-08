import useFormOld from './use-form-old.js';

function useField(name, config) {
  const form = useFormOld(name, config);
  return form.fields[name];
}

export default useField;
