import ProfileEditForm from '@/components/settings/ProfileEditForm';
import SectionHeader from '@/components/settings/SectionHeader';

export default function ProfileEditPage() {
  return (
    <div>
      <SectionHeader
        eyebrow="ACCOUNT SETTINGS"
        title="회원 정보 수정"
        description="프로필 이미지와 서비스에서 사용할 닉네임을 관리하세요."
      />
      <ProfileEditForm />
    </div>
  );
}
