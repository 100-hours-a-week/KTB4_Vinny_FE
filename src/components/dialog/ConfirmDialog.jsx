import { useEffect, useRef } from 'react';
import Button from '@/components/button/Button';
import styles from '@/components/dialog/ConfirmDialog.module.scss';

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = '확인',
  cancelLabel = '취소',
  isPending = false,
  onCancel,
  onConfirm,
}) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  const handleCancel = (event) => {
    event.preventDefault();

    if (!isPending) {
      onCancel();
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
      <h2 id="confirm-dialog-title">{title}</h2>
      <p id="confirm-dialog-description">{description}</p>
      <div className={styles.actions}>
        <Button
          className={`${styles.button} ${styles.cancelButton}`}
          variant="secondary"
          disabled={isPending}
          onClick={onCancel}
        >
          {cancelLabel}
        </Button>
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
