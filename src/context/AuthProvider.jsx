import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  login as requestLogin,
  logout as requestLogout,
} from '@/api/auth';
import { AUTH_UNAUTHORIZED_EVENT } from '@/api/api';
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
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [auth, setAuth] = useState(() => readStoredValue(AUTH_STORAGE_KEY));
  const [user, setUser] = useState(() => readStoredValue(USER_STORAGE_KEY));

  useEffect(() => {
    const handleUnauthorized = () => {
      if (!localStorage.getItem(AUTH_STORAGE_KEY)) {
        return;
      }

      localStorage.removeItem(AUTH_STORAGE_KEY);
      localStorage.removeItem(USER_STORAGE_KEY);
      setAuth(null);
      setUser(null);
      navigate('/login', { replace: true });
    };

    window.addEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);
    return () => {
      window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);
    };
  }, [navigate]);

  useEffect(() => {
    if (isLoggingOut && location.pathname === '/') {
      setIsLoggingOut(false);
    }
  }, [isLoggingOut, location.pathname]);

  const login = async (credentials) => {
    const nextAuth = await requestLogin(credentials);
    const nextUser = await getUser(nextAuth.accessToken);

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextAuth));
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(nextUser));
    setAuth(nextAuth);
    setUser(nextUser);

    return nextUser;
  };

  const logout = useCallback(async ({ requestServer = true } = {}) => {
    const accessToken = auth?.accessToken;

    setIsLoggingOut(true);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
    setAuth(null);
    setUser(null);
    navigate('/', { replace: true });

    if (requestServer && accessToken) {
      try {
        await requestLogout(accessToken);
      } catch {
        // 서버 세션 정리에 실패해도 클라이언트 로그아웃은 계속 진행
      }
    }
  }, [auth?.accessToken, navigate]);

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
      isLoggingOut,
      login,
      logout,
      updateUser,
    }),
    [auth, isLoggingOut, logout, user],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
