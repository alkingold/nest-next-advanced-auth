import { Metadata } from 'next';

import { LoginForm } from '@/features/auth/components';

export const metadata: Metadata = {
  title: 'Login',
  description: 'Log into your account',
};

export default function LoginPage() {
  return <LoginForm />;
}
