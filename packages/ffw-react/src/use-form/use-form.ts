import {useFormContext} from '../context/context.ts';
import {FormReact} from '../plugin/plugin.ts';

export function useForm(customForm?: FormReact) {
  const formContext = useFormContext();
  if (customForm) {
    return customForm;
  }
  return formContext;
}
