import { IUser } from '@/features/auth/types';
import { SettingsContent } from '@/features/user/components/SettingsContent';
import UserButton, {
  UserButtonLoading,
} from '@/features/user/components/UserButton';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui';

type SettingsCardProps = {
  profile: {
    user: IUser | undefined;
    isLoading: boolean;
    error: unknown;
  };
};

export function SettingsCard({ profile }: SettingsCardProps) {
  const { user, isLoading } = profile;

  if (!user) return null;

  return (
    <Card className='w-100'>
      <CardHeader className='flex flex-row items-center justify-between'>
        <CardTitle>Profile Settings</CardTitle>

        {isLoading ? (
          <UserButtonLoading />
        ) : user ? (
          <UserButton user={user} />
        ) : null}
      </CardHeader>

      <CardContent>
        <SettingsContent profile={profile} />
      </CardContent>
    </Card>
  );
}
