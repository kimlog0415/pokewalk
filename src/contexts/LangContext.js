import { createContext, useContext } from 'react';

export const LangContext = createContext('ko');
export const useLang = () => useContext(LangContext);
