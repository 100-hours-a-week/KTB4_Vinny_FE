import PasswordEditForm from '@/components/settings/PasswordEditForm';
import SectionHeader from '@/components/settings/SectionHeader';

export default function PasswordEditPage() {
  return (
    <div>
      <SectionHeader
        eyebrow="SECURITY"
        title="비밀번호 변경"
        description="안전한 계정 사용을 위해 새로운 비밀번호를 입력하세요."
      />
      <PasswordEditForm />
    </div>
  );
}
