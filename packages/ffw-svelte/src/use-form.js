import {getContext} from 'svelte';

function useForm() {
  return getContext('ffw-s');
}

export default useForm;
