import { IUser } from '@/features/auth/types';
import { SettingsForm } from '@/features/user/components/SettingsForm';

import { EmptyState, Error, Loading } from '@/shared/components/ui';

type SettingsContentProps = {
  profile: {
    user: IUser | undefined;
    isLoading: boolean;
    error: unknown;
  };
};

export function SettingsContent({ profile }: SettingsContentProps) {
  const { user, isLoading, error } = profile;

  if (isLoading) return <Loading />;

  if (error) return <Error message='Failed to load profile' />;

  if (!user) return <EmptyState message='User not found' />;

  return <SettingsForm user={user} />;
}
