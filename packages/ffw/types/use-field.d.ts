import FieldReact from './field-react';
import {Form} from 'ffw-base';

type useField = <
  TName extends keyof TForm['_fields'],
  TForm extends Form<FieldReact<TForm['_fields'][], any, any>>
>(
  name: string,
  config: any
) => FieldReact<>;

export default useField;
