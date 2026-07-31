import { useCallback, useEffect, useState } from 'react';

export default function useToast() {
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!toast) {
      return undefined;
    }

    const timeoutId = window.setTimeout(
      () => setToast(null),
      toast.variant === 'error' ? 4000 : 3000,
    );

    return () => window.clearTimeout(timeoutId);
  }, [toast]);

  const closeToast = useCallback(() => setToast(null), []);
  const showToast = useCallback((message, variant = 'success') => {
    setToast({ message, variant });
  }, []);
  const showSuccess = useCallback((message) => {
    setToast({ message, variant: 'success' });
  }, []);
  const showError = useCallback((message) => {
    setToast({ message, variant: 'error' });
  }, []);

  return {
    closeToast,
    showError,
    showSuccess,
    showToast,
    toast,
  };
}
