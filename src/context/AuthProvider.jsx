import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  login as requestLogin,
  logout as requestLogout,
} from '@/api/auth';
import { AUTH_UNAUTHORIZED_EVENT } from '@/api/api';
import { getUser } from '@/api/user';
import ConfirmDialog from '@/components/dialog/ConfirmDialog';
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
  const [isSessionExpired, setIsSessionExpired] = useState(false);
  const [auth, setAuth] = useState(() => readStoredValue(AUTH_STORAGE_KEY));
  const [user, setUser] = useState(() => readStoredValue(USER_STORAGE_KEY));
  const validatedAccessTokenRef = useRef(null);
  const validationPromiseRef = useRef(null);

  useEffect(() => {
    const handleUnauthorized = () => {
      if (!localStorage.getItem(AUTH_STORAGE_KEY)) {
        return;
      }

      localStorage.removeItem(AUTH_STORAGE_KEY);
      localStorage.removeItem(USER_STORAGE_KEY);
      setAuth(null);
      setUser(null);
      setIsSessionExpired(true);
    };

    window.addEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);
    return () => {
      window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);
    };
  }, []);

  const validateSession = useCallback(async () => {
    const accessToken = auth?.accessToken;

    if (!accessToken) {
      return;
    }

    if (validationPromiseRef.current) {
      return validationPromiseRef.current;
    }

    const validationPromise = getUser(accessToken)
      .then((nextUser) => {
        const storedAuth = readStoredValue(AUTH_STORAGE_KEY);

        if (storedAuth?.accessToken !== accessToken) {
          return;
        }

        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(nextUser));
        setUser(nextUser);
      })
      .catch(() => {
        // 401은 전역 unauthorized 이벤트가 처리하고, 일시적인 네트워크 오류는 무시
      })
      .finally(() => {
        validationPromiseRef.current = null;
      });

    validationPromiseRef.current = validationPromise;
    return validationPromise;
  }, [auth?.accessToken]);

  useEffect(() => {
    if (validatedAccessTokenRef.current === auth?.accessToken) {
      return;
    }

    validatedAccessTokenRef.current = auth?.accessToken ?? null;
    validateSession();
  }, [auth?.accessToken, validateSession]);

  useEffect(() => {
    if (!auth?.accessToken) {
      return undefined;
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        validateSession();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [auth?.accessToken, validateSession]);

  useEffect(() => {
    if (isLoggingOut && location.pathname === '/') {
      setIsLoggingOut(false);
    }
  }, [isLoggingOut, location.pathname]);

  const login = async (credentials) => {
    const nextAuth = await requestLogin(credentials);
    const nextUser = await getUser(nextAuth.accessToken);

    validatedAccessTokenRef.current = nextAuth.accessToken;
    setIsSessionExpired(false);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextAuth));
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(nextUser));
    setAuth(nextAuth);
    setUser(nextUser);

    return nextUser;
  };

  const logout = useCallback(async ({ requestServer = true } = {}) => {
    const accessToken = auth?.accessToken;

    setIsLoggingOut(true);
    setIsSessionExpired(false);
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
