import { useEffect, useRef, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { updateUserProfile } from '@/api/user';
import Button from '@/components/button/Button';
import FormInput from '@/components/forminput/FormInput';
import SectionHeader from '@/components/settings/SectionHeader';
import Toast from '@/components/toast/Toast';
import { useAuth } from '@/context/auth-context';
import { profileEditFormSchema } from '@/schema/user';
import { getFullImageUrl } from '@/utils/image';
import styles from '@/pages/ProfileEditPage.module.scss';

const MAX_PROFILE_IMAGE_SIZE = 10 * 1024 * 1024;

export default function ProfileEditPage() {
  const { auth, user, updateUser } = useAuth();
  const profileInputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(
    () => getFullImageUrl(user.profileImage),
  );
  const [imageError, setImageError] = useState('');
  const [toast, setToast] = useState(null);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isDirty, isSubmitting },
  } = useForm({
    resolver: zodResolver(profileEditFormSchema),
    mode: 'onBlur',
    defaultValues: {
      nickname: user.nickname,
      profileImage: null,
    },
  });

  useEffect(() => () => {
    if (previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
  }, [previewUrl]);

  useEffect(() => {
    if (!toast) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setToast(null);
    }, toast.variant === 'error' ? 4000 : 3000);

    return () => window.clearTimeout(timeoutId);
  }, [toast]);

  const handleProfileImageChange = (event) => {
    const [file] = event.target.files;
    setImageError('');
    setToast(null);

    if (!file) {
      return;
    }

    if (file.size > MAX_PROFILE_IMAGE_SIZE) {
      event.target.value = '';
      setImageError('* 프로필 이미지는 10MB 이하만 사용할 수 있습니다.');
      return;
    }

    if (previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }

    setPreviewUrl(URL.createObjectURL(file));
    setValue('profileImage', file, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const handleProfileUpdate = async (values) => {
    setToast(null);

    try {
      const updatedProfile = await updateUserProfile(values, auth.accessToken);
      updateUser(updatedProfile);
      reset({
        nickname: updatedProfile.nickname,
        profileImage: null,
      });
      setPreviewUrl(getFullImageUrl(updatedProfile.profileImage));
      setToast({
        message: '변경사항을 저장했습니다.',
        variant: 'success',
      });
    } catch (error) {
      setToast({
        message: error.message === 'DUPLICATE_NICKNAME'
          ? '이미 사용 중인 닉네임입니다.'
          : error.message || '회원 정보 변경에 실패했습니다.',
        variant: 'error',
      });
    }
  };

  return (
    <div>
      <SectionHeader
        eyebrow="ACCOUNT SETTINGS"
        title="회원 정보 수정"
        description="프로필 이미지와 서비스에서 사용할 닉네임을 관리하세요."
      />

      <form
        className={styles.form}
        onSubmit={handleSubmit(handleProfileUpdate)}
        noValidate
      >
        <div className={styles.profileUpload}>
          <div>
            <strong>프로필 사진</strong>
            <p>10MB 이하의 이미지 파일을 사용할 수 있습니다.</p>
          </div>
          <div className={styles.imageControl}>
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
              aria-label="프로필 사진 변경"
              onClick={() => profileInputRef.current?.click()}
            >
              {previewUrl ? (
                <img src={previewUrl} alt="현재 프로필" />
              ) : (
                <span className={styles.initial}>
                  {user.nickname.trim().charAt(0)}
                </span>
              )}
              <span className={styles.changeLabel}>변경</span>
            </button>
            {imageError && <p className={styles.imageError}>{imageError}</p>}
          </div>
        </div>

        <FormInput
          label="이메일"
          type="email"
          value={user.email}
          readOnly
          aria-readonly="true"
        />
        <FormInput
          label="닉네임"
          type="text"
          placeholder="닉네임을 입력해주세요."
          autoComplete="nickname"
          error={errors.nickname?.message}
          {...register('nickname', {
            onChange: () => {
              setToast(null);
            },
          })}
        />

        <div className={styles.actions}>
          <Button
            className={styles.submitButton}
            type="submit"
            disabled={!isDirty || isSubmitting}
          >
            {isSubmitting ? '저장 중...' : '변경사항 저장'}
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
    </div>
  );
}
