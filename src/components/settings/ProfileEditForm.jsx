import { useRef, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { updateUserProfile } from '@/api/user';
import Button from '@/components/button/Button';
import FormInput from '@/components/input/FormInput';
import ProfileImageInput from '@/components/input/ProfileImageInput';
import Toast from '@/components/toast/Toast';
import { useAuth } from '@/context/auth-context';
import useImagePreview from '@/hooks/useImagePreview';
import useToast from '@/hooks/useToast';
import { profileEditFormSchema } from '@/schema/user';
import { getFullImageUrl } from '@/utils/image';
import styles from '@/components/settings/ProfileEditForm.module.scss';

export default function ProfileEditForm() {
  const { user, updateUser } = useAuth();
  const initialProfileImageUrl = getFullImageUrl(user.profileImage);
  const { previewUrl, setPreviewImage } = useImagePreview(
    initialProfileImageUrl,
  );
  const defaultProfileImageRef = useRef(initialProfileImageUrl);
  const [imageError, setImageError] = useState('');
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
    setValue,
    formState: {
      errors,
      isDirty,
      isSubmitting,
      isValid,
    },
  } = useForm({
    resolver: zodResolver(profileEditFormSchema),
    mode: 'onChange',
    defaultValues: {
      nickname: user.nickname,
      profileImage: null,
    },
  });

  const handleProfileImageChange = (event) => {
    const [file] = event.target.files;
    closeToast();

    setValue('profileImage', file ?? null, {
      shouldDirty: true,
      shouldValidate: true,
    });

    if (file) {
      setPreviewImage(file);
    }

  };

  const handleProfileImageRemove = () => {
    setValue('profileImage', null, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setPreviewImage(defaultProfileImageRef.current);
    setImageError('');
  };

  const handleProfileUpdate = async (values) => {
    closeToast();

    try {
      const updatedProfile = await updateUserProfile(values);
      updateUser(updatedProfile);
      reset({
        nickname: updatedProfile.nickname,
        profileImage: null,
      });
      const updatedProfileImageUrl = getFullImageUrl(
        updatedProfile.profileImage,
      );
      defaultProfileImageRef.current = updatedProfileImageUrl;
      setPreviewImage(updatedProfileImageUrl);
      showSuccess('변경사항을 저장했습니다.');
    } catch (error) {
      showError(error.message || '회원 정보 변경에 실패했습니다.');
    }
  };

  return (
    <>
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
            <ProfileImageInput
              previewUrl={previewUrl}
              onChange={handleProfileImageChange}
              onValidationError={setImageError}
              ariaLabel="프로필 사진 변경"
              imageAlt="현재 프로필"
              fallback={(
                <span className={styles.initial}>
                  {user.nickname.trim().charAt(0)}
                </span>
              )}
              overlay={<span className={styles.changeLabel}>변경</span>}
              buttonClassName={styles.profilePreview}
            />
            <p
              className={`${styles.imageError} ${
                imageError ? '' : styles.imageErrorHidden
              }`}
              role={imageError ? 'alert' : undefined}
              aria-hidden={!imageError}
            >
              <span>{imageError || '\u00a0'}</span>
              {imageError ? (
                <button
                  className={styles.imageErrorAction}
                  type="button"
                  onClick={handleProfileImageRemove}
                >
                  선택 취소
                </button>
              ) : null}
            </p>
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
              closeToast();
            },
          })}
        />

        <div className={styles.actions}>
          <Button
            className={styles.submitButton}
            type="submit"
            disabled={!isDirty || !isValid || isSubmitting}
          >
            {isSubmitting ? '저장 중...' : '변경사항 저장'}
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
