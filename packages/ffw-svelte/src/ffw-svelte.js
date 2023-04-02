import {setContext, getContext} from 'svelte';
import {addSveltePlugin} from './add-svelte/add-svelte.js';

export const setFfwContext = (form) => setContext('ffw-svelte', form);
export const getFfwContext = () => getContext('ffw-svelte');
export {addSveltePlugin};
