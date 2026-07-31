import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { updateUserPassword } from '@/api/user';
import Button from '@/components/button/Button';
import FormInput from '@/components/input/FormInput';
import Toast from '@/components/toast/Toast';
import { useAuth } from '@/context/auth-context';
import useToast from '@/hooks/useToast';
import { passwordChangeSchema } from '@/schema/user';
import styles from '@/components/settings/PasswordChangeForm.module.scss';

export default function PasswordChangeForm() {
  const { auth } = useAuth();
  const {
    closeToast,
    showError,
    showSuccess,
    toast,
  } = useToast();
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

  const handlePasswordChange = async (formValues) => {
    closeToast();

    try {
      await updateUserPassword(formValues, auth.accessToken);
      reset();
      showSuccess('비밀번호를 변경했습니다.');
    } catch (error) {
      showError(error.message || '비밀번호 변경에 실패했습니다.');
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
            onChange: closeToast,
          })}
        />
        <FormInput
          label="비밀번호 확인"
          type="password"
          placeholder="비밀번호를 한 번 더 입력하세요."
          autoComplete="new-password"
          error={errors.passwordConfirm?.message}
          {...register('passwordConfirm', {
            onChange: closeToast,
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
          onClose={closeToast}
        >
          {toast.message}
        </Toast>
      )}
    </>
  );
}
