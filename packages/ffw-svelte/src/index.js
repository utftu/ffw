import initForm from './init-form';
import useForm from './use-form';
import {setContext, getContext} from 'svelte';
import {prepareYup} from 'ffw';

export const setFfwContext = (form) => setContext('ffw-s', form);
export const getFfwContext = () => getContext('ffw-s');
export {prepareYup, initForm as initFFw, useForm as getFfw};
