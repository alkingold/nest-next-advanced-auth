'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { FaGoogle, FaYandex } from 'react-icons/fa';

import { PROVIDER_GOOGLE, PROVIDER_YANDEX } from '@/features/auth/constants';
import { authService } from '@/features/auth/services';
import { OAuthProviderType } from '@/features/auth/types';

import { Button } from '@/shared/components/ui';

export function AuthSocial() {
  const router = useRouter();

  const { mutateAsync } = useMutation({
    mutationKey: ['oauth by provider'],
    mutationFn: (provider: OAuthProviderType) =>
      authService.oauthByProvider(provider),
  });

  const handleClick = async (provider: OAuthProviderType) => {
    const response = await mutateAsync(provider);

    if (response) {
      router.push(response.url);
    }
  };

  return (
    <>
      <div className='mb-4 grid grid-cols-2 gap-6'>
        <Button onClick={() => handleClick(PROVIDER_GOOGLE)} variant='outline'>
          <FaGoogle className='mr-2 size-4' />
          Google
        </Button>
        <Button onClick={() => handleClick(PROVIDER_YANDEX)} variant='outline'>
          <FaYandex className='mr-2 size-4' />
          Yandex
        </Button>
      </div>
      <div className='relative mb-2'>
        <div className='absolute inset-0 flex items-center'>
          <span className='w-full border-t' />
        </div>
        <div className='relative flex justify-center text-xs uppercase'>
          <span className='bg-background text-muted-foreground px-2'>Or</span>
        </div>
      </div>
    </>
  );
}
