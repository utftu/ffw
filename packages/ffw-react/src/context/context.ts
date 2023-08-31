import {createContext, useContext} from 'react';
import {FormReact} from '../plugin/plugin.ts';

export const ffwContext = createContext<FormReact | null>(null);
export const FfwProvider = ffwContext.Provider;
export const useFormContext = () => useContext(ffwContext);
