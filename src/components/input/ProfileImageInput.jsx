import { useId, useRef } from 'react';
import styles from '@/components/input/ProfileImageInput.module.scss';

export default function ProfileImageInput({
  previewUrl,
  onChange,
  ariaLabel,
  imageAlt,
  fallback,
  overlay,
  buttonClassName = '',
  error,
  errorClassName = '',
}) {
  const inputRef = useRef(null);
  const generatedId = useId();
  const errorId = `${generatedId}-error`;

  return (
    <>
      <input
        ref={inputRef}
        id={generatedId}
        className={styles.input}
        type="file"
        accept="image/*"
        onChange={onChange}
      />
      <button
        className={buttonClassName}
        type="button"
        aria-label={ariaLabel}
        aria-describedby={error ? errorId : undefined}
        onClick={() => inputRef.current?.click()}
      >
        {previewUrl ? (
          <img className={styles.image} src={previewUrl} alt={imageAlt} />
        ) : (
          fallback
        )}
        {overlay}
      </button>
      {error ? (
        <p
          id={errorId}
          className={errorClassName}
          role="alert"
        >
          {error}
        </p>
      ) : null}
    </>
  );
}
