import {Form} from 'packages/ffw';
import FieldReact from './field-react';

type useForm = (...deps: string[] | any) => Form<FieldReact>;

export default useForm;
