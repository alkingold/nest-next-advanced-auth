'use client';

import { SettingsCard } from '@/features/user/components/SettingsCard';

import useProfile from '@/shared/hooks/useProfile';

export function SettingsPageContainer() {
  const profile = useProfile();

  return <SettingsCard profile={profile} />;
}
