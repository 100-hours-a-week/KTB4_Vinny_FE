import { useCallback, useEffect, useRef, useState } from 'react';

export default function useImagePreview(initialUrl = '') {
  const objectUrlRef = useRef('');
  const [previewUrl, setPreviewUrl] = useState(initialUrl);

  const revokeObjectUrl = useCallback(() => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = '';
    }
  }, []);

  const setPreviewImage = useCallback((image) => {
    revokeObjectUrl();

    if (image instanceof File) {
      const objectUrl = URL.createObjectURL(image);
      objectUrlRef.current = objectUrl;
      setPreviewUrl(objectUrl);
      return;
    }

    setPreviewUrl(image || '');
  }, [revokeObjectUrl]);

  useEffect(() => revokeObjectUrl, [revokeObjectUrl]);

  return {
    previewUrl,
    setPreviewImage,
  };
}
