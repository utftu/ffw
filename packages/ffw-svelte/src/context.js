import {setContext, getContext} from 'svelte';

const defaultKey = 'ffw-svelte';

export const setFfwContext = (form, key = defaultKey) => setContext(key, form);
export const getFfwContext = (key = defaultKey) => getContext(key);
