import { useRef } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { signup } from '@/api/auth';
import AuthHeader from '@/components/auth/AuthHeader';
import Button from '@/components/button/Button';
import FormInput from '@/components/input/FormInput';
import useImagePreview from '@/hooks/useImagePreview';
import { signupSchema } from '@/schema/auth';
import styles from '@/components/signup/SignupForm.module.scss';

export default function SignupForm() {
  const navigate = useNavigate();
  const profileInputRef = useRef(null);
  const { previewUrl, setPreviewImage } = useImagePreview();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signupSchema),
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
      passwordConfirm: '',
      nickname: '',
      profileImage: null,
    },
  });
  const values = watch();
  const isSignupFormValid = signupSchema.safeParse(values).success;

  const handleProfileImageChange = (event) => {
    const [file] = event.target.files;

    setValue('profileImage', file ?? null, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setPreviewImage(file);
  };

  const handleSignup = async (formValues) => {
    try {
      await signup(formValues);
      alert('회원가입이 완료되었습니다.');
      navigate('/login', { replace: true });
    } catch (error) {
      alert(error.message || '회원가입에 실패했습니다.');
    }
  };

  return (
    <section className={styles.signupPanel}>
      <AuthHeader
        title="회원가입"
        description="프로필을 만들고 영화 취향과 리뷰를 한 곳에 모아보세요."
      />

      <div className={styles.profileUpload}>
        <span className={styles.profileLabel}>프로필 사진</span>
        <input
          ref={profileInputRef}
          className={styles.profileInput}
          type="file"
          accept="image/*"
          onChange={handleProfileImageChange}
        />
        <button
          className={styles.profilePreview}
          type="button"
          aria-label="프로필 사진 추가"
          onClick={() => profileInputRef.current?.click()}
        >
          {previewUrl ? (
            <img
              className={styles.profileImage}
              src={previewUrl}
              alt="선택한 프로필 사진"
            />
          ) : (
            <span aria-hidden="true">+</span>
          )}
        </button>
      </div>

      <form
        className={styles.form}
        onSubmit={handleSubmit(handleSignup)}
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
          autoComplete="new-password"
          error={errors.password?.message}
          {...register('password')}
        />
        <FormInput
          label="비밀번호 확인"
          type="password"
          placeholder="비밀번호를 한번 더 입력하세요"
          autoComplete="new-password"
          error={errors.passwordConfirm?.message}
          {...register('passwordConfirm')}
        />
        <FormInput
          label="닉네임"
          type="text"
          placeholder="닉네임을 입력하세요"
          autoComplete="nickname"
          error={errors.nickname?.message}
          {...register('nickname')}
        />
        <Button
          className={styles.submitButton}
          type="submit"
          fullWidth
          disabled={!isSignupFormValid || isSubmitting}
        >
          {isSubmitting ? '가입 중...' : '회원가입'}
        </Button>
      </form>

      <Button
        className={styles.loginButton}
        variant="ghost"
        to="/login"
      >
        이미 계정이 있나요? 로그인
      </Button>
    </section>
  );
}
