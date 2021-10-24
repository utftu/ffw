import useForm from "./use-form";
import type Field from './Field'
import type {Config} from "./use-unsync-form";

function useField(name: string, config?: Config): Field {
  const form = useForm(name, config)
  return form.fields[name]
}

export default useField