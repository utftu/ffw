import initForm from './init-form';
import useForm from './use-form';
import {setContext, getContext} from 'svelte';

const preparedSetContext = (form) => setContext('ffw-s', form);
const preparedGetContext = () => getContext('ffw-s');
export {
  initForm as initFFw,
  useForm as getFfw,
  preparedSetContext as setFfwContext,
  preparedGetContext as getFfwContext,
};
