import initForm from './init-form';
import {setContext} from 'svelte';
import type {Form} from 'ffw-base';

const preparedSetContext = (form: Form) => setContext('ffw-s', form);
export {initForm, preparedSetContext as setContext};
