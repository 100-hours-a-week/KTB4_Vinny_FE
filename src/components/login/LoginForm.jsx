import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import AuthHeader from '@/components/auth/AuthHeader';
import Button from '@/components/Button/Button';
import FormInput from '@/components/FormInput/FormInput';
import { loginSchema } from '@/schema/auth';
import styles from '@/components/login/LoginForm.module.scss';

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleLogin = () => {
    // TODO: 로그인 API 연결
  };

  return (
    <section className={styles.loginPanel}>
      <AuthHeader
        title="로그인"
        description="좋아하는 영화를 다시 만나고, 남겨둔 리뷰를 이어서 확인하세요."
      />
      <form
        className={styles.form}
        onSubmit={handleSubmit(handleLogin)}
        noValidate
      >
        <FormInput
          label="이메일"
          type="email"
          placeholder="이메일을 입력하세요"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />
        <FormInput
          label="비밀번호"
          type="password"
          placeholder="비밀번호를 입력하세요"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register('password')}
        />
        <Button
          className={styles.submitButton}
          type="submit"
          fullWidth
          disabled={!isValid}
        >
          로그인
        </Button>
      </form>
      <Button
        className={styles.signupButton}
        variant="ghost"
        to="/signup"
      >
        아직 계정이 없나요? 회원가입
      </Button>
    </section>
  );
}
