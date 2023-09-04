import {setContext, getContext} from 'svelte';
import {FormFfwSvelte} from '../plugin/plugin.ts';

const defaultKey = 'ffw-svelte';

export const setFfwContext = (form: FormFfwSvelte, key = defaultKey) =>
  setContext(key, form);
export const getFfwContext = (key = defaultKey) =>
  getContext<FormFfwSvelte>(key);
