import {setContext, getContext} from 'svelte';
import {addSvelte} from './add-svelte/add-svelte.js'

export const setFfwContext = (form) => setContext('ffw-svelte', form);
export const getFfwContext = () => getContext('ffw-svelte');
export {addSvelte};
