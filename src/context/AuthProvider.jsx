import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import {
  login as requestLogin,
  logout as requestLogout,
} from '@/api/auth';
import { AUTH_UNAUTHORIZED_EVENT } from '@/api/api';
import { getUser } from '@/api/user';
import ConfirmDialog from '@/components/dialog/ConfirmDialog';
import { AuthContext } from '@/context/auth-context';

export default function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [isInitializing, setIsInitializing] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isSessionExpired, setIsSessionExpired] = useState(false);
  const [user, setUser] = useState(null);
  const userRef = useRef(null);
  const validationPromiseRef = useRef(null);

  const setCurrentUser = useCallback((nextUser) => {
    userRef.current = nextUser;
    setUser(nextUser);
  }, []);

  useEffect(() => {
    const handleUnauthorized = () => {
      if (!userRef.current) {
        return;
      }

      setCurrentUser(null);
      setIsSessionExpired(true);
    };

    window.addEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);
    return () => {
      window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);
    };
  }, [setCurrentUser]);

  const validateSession = useCallback(async () => {
    if (validationPromiseRef.current) {
      return validationPromiseRef.current;
    }

    const validationPromise = getUser()
      .then((nextUser) => {
        setCurrentUser(nextUser);
        return nextUser;
      })
      .catch(() => {
        setCurrentUser(null);
        return null;
      })
      .finally(() => {
        validationPromiseRef.current = null;
        setIsInitializing(false);
      });

    validationPromiseRef.current = validationPromise;
    return validationPromise;
  }, [setCurrentUser]);

  useEffect(() => {
    validateSession();
  }, [validateSession]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && userRef.current) {
        validateSession();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [validateSession]);

  const login = useCallback(async (credentials) => {
    await requestLogin(credentials);
    const nextUser = await getUser();

    setIsSessionExpired(false);
    setCurrentUser(nextUser);
    return nextUser;
  }, [setCurrentUser]);

  const logout = useCallback(async ({ requestServer = true } = {}) => {
    setIsLoggingOut(true);
    setIsSessionExpired(false);

    if (requestServer) {
      try {
        await requestLogout();
      } catch (error) {
        setIsLoggingOut(false);
        throw error;
      }
    }

    setCurrentUser(null);
    setIsLoggingOut(false);
    navigate('/', { replace: true });
  }, [navigate, setCurrentUser]);

  const updateUser = useCallback((updatedUser) => {
    setCurrentUser({
      ...userRef.current,
      ...updatedUser,
    });
  }, [setCurrentUser]);

  const value = useMemo(
    () => ({
      user,
      isInitializing,
      isLoggedIn: Boolean(user),
      isLoggingOut,
      login,
      logout,
      updateUser,
    }),
    [isInitializing, isLoggingOut, login, logout, updateUser, user],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
      <ConfirmDialog
        confirmLabel="로그인하기"
        description="로그인 세션이 만료되었습니다. 다시 로그인해주세요."
        onConfirm={() => {
          setIsSessionExpired(false);
          navigate('/login', { replace: true });
        }}
        open={isSessionExpired}
        showCancel={false}
        title="세션이 만료되었습니다"
      />
    </AuthContext.Provider>
  );
}
