import { type Metadata } from 'next';

import { SettingsPageContainer } from '@/features/user/components';

export const metadata: Metadata = {
  title: 'Profile Settings',
};

export default function SettingsPage() {
  return <SettingsPageContainer />;
}
