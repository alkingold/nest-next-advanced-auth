'use client';

import { useState } from 'react';

import { LoginForm } from '@/features/auth/components/LoginForm';
import { LoginTwoFactorForm } from '@/features/auth/components/LoginTwoFactorForm';
import { useLoginMutation } from '@/features/auth/hooks';

import { AuthWrapper } from './AuthWrapper';

export function LoginContainer() {
  const [isShowTwoFactor, setIsShowTwoFactor] = useState<boolean>(false);
  const [credentials, setCredentials] = useState<{
    email: string;
    password: string;
  } | null>(null);

  const { login, isLoadingLogin } = useLoginMutation({
    onTwoFactorRequired: () => {
      setIsShowTwoFactor(true);
    },
    onLoginSuccess: () => setCredentials(null),
  });

  const handleFirstFormSubmit = (
    email: string,
    password: string,
    recaptcha?: string,
  ) => {
    setCredentials({ email, password });
    login({ values: { email, password }, recaptcha });
  };

  const handleTwoFactorFormSubmit = (code: string) => {
    if (!credentials) return;

    login({ values: { ...credentials, code } });
    setCredentials(null);
    setIsShowTwoFactor(false);
  };

  return (
    <AuthWrapper
      heading='Welcome Back'
      description='Please sign in to your account'
      backButtonLabel="Don't have an account? Register"
      backButtonHref='/auth/register'
      isShowSocialAuth={true}
    >
      {isShowTwoFactor ? (
        <LoginTwoFactorForm
          login={handleTwoFactorFormSubmit}
          isLoadingLogin={isLoadingLogin}
        />
      ) : (
        <LoginForm
          login={handleFirstFormSubmit}
          isLoadingLogin={isLoadingLogin}
        />
      )}
    </AuthWrapper>
  );
}
