import {Form} from 'ffw-base';
import FieldReact from './field-react';

type useForm = (...deps: string[] | any) => Form<FieldReact>;

export default useForm;
