import React from 'react';
import { useStorageState } from './useStorageState';

const AuthContext = React.createContext<{
  signIn: (name: string) => void;
  signOut: () => void;
  session: string | null;
  isLoading: boolean;
  userName: string | null;
}>({
  signIn: () => null,
  signOut: () => null,
  session: null,
  isLoading: false,
  userName: null,
});

// This hook can be used to access the user info.
export function useSession() {
  const value = React.useContext(AuthContext);
  if (process.env.NODE_ENV !== 'production') {
    if (!value) {
      throw new Error('useSession must be wrapped in a <SessionProvider />');
    }
  }
  return value;
}

export function SessionProvider(props: React.PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState('session');
  const [[isLoadingName, userName], setUserName] = useStorageState('user_name_auth');

  return (
    <AuthContext.Provider
      value={{
        signIn: (name: string) => {
          // Perform sign-in logic here
          setSession('xxx-dummy-token-xxx');
          setUserName(name);
        },
        signOut: () => {
          setSession(null);
          setUserName(null);
        },
        session,
        isLoading,
        userName,
      }}>
      {props.children}
    </AuthContext.Provider>
  );
}