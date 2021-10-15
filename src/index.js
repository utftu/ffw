import useForm from './use-form.js';
import context from './conext.js';
import useGlobalForm from './use-global-form.js';

const Provider = context.Provider;
export {
  useForm as useFfs,
  Provider as FfsProvider,
  useGlobalForm as useGlobalFfs,
};
