import type {Form} from 'ffw-base'

type useUnsubForm = (deps: string[]|any) => {
  form: Form,
  fieldNames: string[]
}

export default useUnsubForm