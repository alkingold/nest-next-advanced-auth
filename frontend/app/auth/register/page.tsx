import { Metadata } from 'next';

import { RegisterForm } from '@/features/auth/components';

export const metadata: Metadata = {
  title: 'Register',
  description: 'Create a new account',
};

export default function RegisterPage() {
  return <RegisterForm />;
}
