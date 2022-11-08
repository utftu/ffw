import {createContext, useContext} from 'react';

export const ffwContext = createContext(null);
export const FfwProvider = ffwContext.Provider;
export const useFormContext = () => useContext(ffwContext);
