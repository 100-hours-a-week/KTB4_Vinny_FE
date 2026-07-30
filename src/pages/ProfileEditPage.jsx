import { useEffect, useRef, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { updateUserProfile } from '@/api/user';
import Button from '@/components/button/Button';
import FormInput from '@/components/forminput/FormInput';
import SectionHeader from '@/components/settings/SectionHeader';
import { useAuth } from '@/context/auth-context';
import { profileEditSchema } from '@/schema/user';
import styles from '@/pages/ProfileEditPage.module.scss';

const MAX_PROFILE_IMAGE_SIZE = 10 * 1024 * 1024;

export default function ProfileEditPage() {
  const { auth, user, updateUser } = useAuth();
  const profileInputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(user.profileImage || '');
  const [imageError, setImageError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm({
    resolver: zodResolver(profileEditSchema),
    mode: 'onBlur',
    defaultValues: {
      nickname: user.nickname,
      profileImage: user.profileImage,
    },
  });

  useEffect(() => () => {
    if (previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
  }, [previewUrl]);

  const handleProfileImageChange = (event) => {
    const [file] = event.target.files;
    setImageError('');
    setIsSaved(false);

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
    setImageError('* 이미지 업로드 API 연결 후 변경할 수 있습니다.');
  };

  const handleProfileUpdate = async (values) => {
    setSubmitError('');
    setIsSaved(false);

    try {
      const updatedProfile = await updateUserProfile(values, auth.accessToken);
      updateUser(updatedProfile);
      reset(updatedProfile);
      setPreviewUrl(updatedProfile.profileImage || '');
      setIsSaved(true);
    } catch (error) {
      setSubmitError(
        error.message === 'DUPLICATE_NICKNAME'
          ? '* 이미 사용 중인 닉네임입니다.'
          : error.message || '* 회원 정보 변경에 실패했습니다.',
      );
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
              setSubmitError('');
              setIsSaved(false);
            },
          })}
        />

        <div className={styles.actions}>
          <p
            className={submitError ? styles.submitError : styles.success}
            role={submitError ? 'alert' : 'status'}
          >
            {submitError || (isSaved ? '변경사항을 저장했습니다.' : '')}
          </p>
          <Button
            className={styles.submitButton}
            type="submit"
            disabled={!isDirty || isSubmitting || Boolean(imageError)}
          >
            {isSubmitting ? '저장 중...' : '변경사항 저장'}
          </Button>
        </div>
      </form>
    </div>
  );
}
