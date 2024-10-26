'use client';

import React, { createContext } from 'react';

interface Props {
  children: React.ReactNode;
}

interface AuthContextType {
  token: string | null;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
}

export const AuthContext = createContext<AuthContextType>({
  token: null,
  setToken: () => {
    throw new Error('setToken is not implemented');
  },
});

export const AuthContextProvider = ({ children }: Props) => {
  const [token, setToken] = React.useState<string | null>(null);

  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
