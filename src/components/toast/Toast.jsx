import styles from '@/components/toast/Toast.module.scss';

export default function Toast({ children, onClose, variant = 'success' }) {
  return (
    <div
      className={`${styles.toast} ${styles[variant]}`}
      role={variant === 'error' ? 'alert' : 'status'}
      aria-live={variant === 'error' ? 'assertive' : 'polite'}
    >
      <span>{children}</span>
      <button type="button" aria-label="알림 닫기" onClick={onClose}>
        ×
      </button>
    </div>
  );
}
