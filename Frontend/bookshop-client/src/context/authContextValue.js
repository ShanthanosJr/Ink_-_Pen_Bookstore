// Kept separate from AuthContext.jsx so that file only exports components (keeps React fast refresh working)
import { createContext, useContext } from 'react';

export const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);
