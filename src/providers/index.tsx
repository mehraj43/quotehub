import type { ReactNode } from 'react';
import AuthContextProvider from './AuthProvider';

export default function Providers({ children }: { children: ReactNode }) {
  return <AuthContextProvider>{children}</AuthContextProvider>;
}
