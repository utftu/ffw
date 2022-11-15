import {useFormContext} from '../context/context.js';

function useForm(customForm) {
  const formContext = useFormContext();
  if (customForm) {
    return customForm;
  }
  return formContext;
}

export default useForm;
