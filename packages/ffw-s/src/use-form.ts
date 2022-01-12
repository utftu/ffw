import {getContext} from 'svelte';
import type {Form} from 'ffw-base';

function useForm() {
  return getContext<Form>('ffw-s');
}

export default useForm;
