import FieldReact from './field-react';
import {Form} from 'packages/ffw';

type useField = <
  TName extends keyof TForm['_fields'],
  TForm extends Form<FieldReact<TForm['_fields'][], any, any>>
>(
  name: string,
  config: any
) => FieldReact<>;

export default useField;
