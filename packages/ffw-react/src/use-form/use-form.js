import {useFormContext} from '../context/context.js';

export function useForm(customForm) {
  const formContext = useFormContext();
  if (customForm) {
    return customForm;
  }
  return formContext;
}
