import initForm from './init-form';
import useForm from './use-form';
import {setContext} from 'svelte';
import type {Form} from 'ffw-base';

const preparedSetContext = (form: Form) => setContext('ffw-s', form);
export {initForm, useForm, useForm as useFfw, preparedSetContext as setContext};
