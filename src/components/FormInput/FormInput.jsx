import { useId } from 'react';
import styles from '@/components/FormInput/FormInput.module.scss';

export default function FormInput({
  id,
  label,
  error,
  className = '',
  inputClassName = '',
  ...inputProps
}) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const messageId = `${inputId}-message`;
  const hasError = Boolean(error);

  return (
    <div className={`${styles.field} ${className}`.trim()}>
      {label && (
        <label className={styles.label} htmlFor={inputId}>
          {label}
        </label>
      )}
      <input
        {...inputProps}
        id={inputId}
        className={[
          styles.input,
          inputClassName,
        ]
          .filter(Boolean)
          .join(' ')}
        aria-describedby={error ? messageId : undefined}
        aria-invalid={hasError}
      />
      <p
        className={[
          styles.error,
          hasError ? '' : styles.errorHidden,
        ]
          .filter(Boolean)
          .join(' ')}
        id={messageId}
        role={hasError ? 'alert' : undefined}
        aria-hidden={!hasError}
      >
        {error || '\u00A0'}
      </p>
    </div>
  );
}
