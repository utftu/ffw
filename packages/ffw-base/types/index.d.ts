import type Field from './field'
import type Form from './form'

type createFormProxy<TField extends Field = Field> = () => Form<TField>
export {
  Field,
  Form,
  Field as FfwField,
  Form as FfwForm,
}