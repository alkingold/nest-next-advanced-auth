'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

import { AuthWrapper } from '@/features/auth/components';
import { useVerificationMutation } from '@/features/auth/hooks';

import { Loading } from '@/shared/components/ui';

export function NewVerificationForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const { confirmEmail } = useVerificationMutation();

  useEffect(() => {
    confirmEmail(token);
  }, [token, confirmEmail]);

  return (
    <AuthWrapper heading='Email confirmation'>
      <div>
        <Loading />
      </div>
    </AuthWrapper>
  );
}
