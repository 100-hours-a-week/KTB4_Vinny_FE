import { useId, useRef } from 'react';
import { profileImageSchema } from '@/schema/validation';
import styles from '@/components/input/ProfileImageInput.module.scss';

export default function ProfileImageInput({
  previewUrl,
  onChange,
  onValidationError,
  ariaLabel,
  imageAlt,
  fallback,
  overlay,
  buttonClassName = '',
}) {
  const inputRef = useRef(null);
  const generatedId = useId();

  const handleChange = (event) => {
    const [file] = event.target.files;

    const validationResult = profileImageSchema.safeParse(file ?? null);

    if (!validationResult.success) {
      onValidationError?.(validationResult.error.issues[0].message);
      onChange?.(event);
      event.target.value = '';
      return;
    }

    onValidationError?.('');
    onChange?.(event);
  };

  return (
    <>
      <input
        ref={inputRef}
        id={generatedId}
        className={styles.input}
        type="file"
        accept="image/*"
        onChange={handleChange}
      />
      <button
        className={buttonClassName}
        type="button"
        aria-label={ariaLabel}
        onClick={() => inputRef.current?.click()}
      >
        {previewUrl ? (
          <img className={styles.image} src={previewUrl} alt={imageAlt} />
        ) : (
          fallback
        )}
        {overlay}
      </button>
    </>
  );
}
