import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { updateUserPassword } from '@/api/user';
import Button from '@/components/button/Button';
import FormInput from '@/components/input/FormInput';
import Toast from '@/components/toast/Toast';
import { useAuth } from '@/context/auth-context';
import { passwordChangeSchema } from '@/schema/user';
import styles from '@/components/settings/PasswordChangeForm.module.scss';

export default function PasswordChangeForm() {
  const { auth } = useAuth();
  const [toast, setToast] = useState(null);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(passwordChangeSchema),
    mode: 'onBlur',
    defaultValues: {
      password: '',
      passwordConfirm: '',
    },
  });
  const values = watch();
  const isFormValid = passwordChangeSchema.safeParse(values).success;

  useEffect(() => {
    if (!toast) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setToast(null);
    }, toast.variant === 'error' ? 4000 : 3000);

    return () => window.clearTimeout(timeoutId);
  }, [toast]);

  const handlePasswordChange = async (formValues) => {
    setToast(null);

    try {
      await updateUserPassword(formValues, auth.accessToken);
      reset();
      setToast({
        message: '비밀번호를 변경했습니다.',
        variant: 'success',
      });
    } catch (error) {
      setToast({
        message: error.message || '비밀번호 변경에 실패했습니다.',
        variant: 'error',
      });
    }
  };

  return (
    <>
      <form
        className={styles.form}
        onSubmit={handleSubmit(handlePasswordChange)}
        noValidate
      >
        <FormInput
          label="비밀번호"
          type="password"
          placeholder="비밀번호를 입력하세요."
          autoComplete="new-password"
          error={errors.password?.message}
          {...register('password', {
            onChange: () => setToast(null),
          })}
        />
        <FormInput
          label="비밀번호 확인"
          type="password"
          placeholder="비밀번호를 한 번 더 입력하세요."
          autoComplete="new-password"
          error={errors.passwordConfirm?.message}
          {...register('passwordConfirm', {
            onChange: () => setToast(null),
          })}
        />

        <div className={styles.actions}>
          <Button
            className={styles.submitButton}
            type="submit"
            disabled={!isFormValid || isSubmitting}
          >
            {isSubmitting ? '변경 중...' : '비밀번호 변경'}
          </Button>
        </div>
      </form>

      {toast && (
        <Toast
          variant={toast.variant}
          onClose={() => setToast(null)}
        >
          {toast.message}
        </Toast>
      )}
    </>
  );
}
