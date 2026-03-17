import { Metadata } from 'next';

import { LoginContainer } from '@/features/auth/components/LoginContainer';

export const metadata: Metadata = {
  title: 'Login',
  description: 'Log into your account',
};

export default function LoginPage() {
  return <LoginContainer />;
}
