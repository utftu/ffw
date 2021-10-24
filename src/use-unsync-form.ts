import {useContext} from 'react';
import context from './conext';
import type Form from './form';

export type Config =
  | {
      context: any;
    }
  | {form: Form};

function useUnsyncForm(deps: string[] | any[]): {
  form: Form;
  fieldNames: string[];
} {
  const lastArg = deps[deps.length - 1];
  const config =
    typeof lastArg !== 'string' && !Array.isArray(lastArg)
      ? (lastArg as Config)
      : null;

  let fieldNames;
  if (Array.isArray(deps[0])) {
    fieldNames = deps[0];
  } else {
    if (config) {
      fieldNames = deps.slice(0, deps.length - 1);
    } else {
      fieldNames = deps;
    }
  }

  const contextForm = useContext<Form>((config as any)?.context ?? context);
  const form = (config as any)?.form ?? contextForm;

  return {
    form,
    fieldNames,
  };
}

export default useUnsyncForm;
