import useForm from './use-form';
import context from './conext';
import useGlobalForm from './use-global-form';

const Provider = context.Provider;
export {
  useForm as useFfs,
  Provider as FfsProvider,
  useGlobalForm as useGlobalFfs,
};
