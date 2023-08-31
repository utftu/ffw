import {createContext, useContext} from 'solid-js';
import {FormSolid} from '../plugin/plugin.ts';

const context = createContext<FormSolid>();

export const getFfwContext = () => useContext(context);
export const FfwContextProvider = context.Provider;
