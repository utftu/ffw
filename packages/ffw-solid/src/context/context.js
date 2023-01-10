import {createContext, useContext} from 'solid-js';

const context = createContext();

export const getFfwContext = () => useContext(context);
export const FfwContextProvider = context.Provider;
