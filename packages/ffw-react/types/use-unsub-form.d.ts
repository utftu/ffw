import type {Form} from 'packages/ffw';

type useUnsubForm = (deps: string[] | any) => {
  form: Form;
  fieldNames: string[];
};

export default useUnsubForm;
