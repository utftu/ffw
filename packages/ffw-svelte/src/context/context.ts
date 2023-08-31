import {setContext, getContext} from 'svelte';
import {FormSvelte} from '../plugin/plugin.ts';

const defaultKey = 'ffw-svelte';

export const setFfwContext = (form: FormSvelte, key = defaultKey) =>
  setContext(key, form);
export const getFfwContext = (key = defaultKey) => getContext<FormSvelte>(key);
