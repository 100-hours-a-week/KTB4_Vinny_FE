import { useEffect, useRef } from 'react';
import Button from '@/components/button/Button';
import styles from '@/components/dialog/ConfirmDialog.module.scss';

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = '확인',
  cancelLabel = '취소',
  showCancel = true,
  isPending = false,
  onCancel,
  onConfirm,
}) {
  const dialogRef = useRef(null);
  const titleRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (open && !dialog.open) {
      dialog.showModal();
      titleRef.current?.focus({ preventScroll: true });
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  const handleCancel = (event) => {
    event.preventDefault();

    if (!isPending) {
      (onCancel ?? onConfirm)();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
      onCancel={handleCancel}
    >
      <h2 id="confirm-dialog-title" ref={titleRef} tabIndex={-1}>{title}</h2>
      <p id="confirm-dialog-description">{description}</p>
      <div className={`${styles.actions} ${!showCancel ? styles.singleAction : ''}`}>
        {showCancel ? (
          <Button
            className={`${styles.button} ${styles.cancelButton}`}
            variant="secondary"
            disabled={isPending}
            onClick={onCancel ?? onConfirm}
          >
            {cancelLabel}
          </Button>
        ) : null}
        <Button
          className={styles.button}
          disabled={isPending}
          onClick={onConfirm}
        >
          {isPending ? '처리 중...' : confirmLabel}
        </Button>
      </div>
    </dialog>
  );
}
