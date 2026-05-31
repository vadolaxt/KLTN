import ProfileLayout from '@/features/profile/ProfileLayout';
import AuthRequired from '@/shared/components/AuthRequired';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AuthRequired featureName="hồ sơ thí sinh">
      <ProfileLayout>{children}</ProfileLayout>
    </AuthRequired>
  );
}
