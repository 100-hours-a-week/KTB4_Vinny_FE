import {
  useMemo,
  useState,
} from 'react';
import {
  login as requestLogin,
} from '@/api/auth';
import { getUser } from '@/api/user';
import { AuthContext } from '@/context/auth-context';

const AUTH_STORAGE_KEY = 'auth';
const USER_STORAGE_KEY = 'user';

function readStoredValue(key) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch {
    localStorage.removeItem(key);
    return null;
  }
}

export default function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => readStoredValue(AUTH_STORAGE_KEY));
  const [user, setUser] = useState(() => readStoredValue(USER_STORAGE_KEY));

  const login = async (credentials) => {
    const nextAuth = await requestLogin(credentials);
    const nextUser = await getUser(nextAuth.accessToken);

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextAuth));
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(nextUser));
    setAuth(nextAuth);
    setUser(nextUser);

    return nextUser;
  };

  const logout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
    setAuth(null);
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    setUser((currentUser) => {
      const nextUser = {
        ...currentUser,
        ...updatedUser,
      };

      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(nextUser));
      return nextUser;
    });
  };

  const value = useMemo(
    () => ({
      auth,
      user,
      isLoggedIn: Boolean(auth?.accessToken && user),
      login,
      logout,
      updateUser,
    }),
    [auth, user],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
