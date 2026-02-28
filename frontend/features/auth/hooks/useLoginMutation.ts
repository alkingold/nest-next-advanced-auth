import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction } from 'react';
import { toast } from 'sonner';

import { LoginDto } from '@/features/auth/dtos';
import { authService } from '@/features/auth/services';
import { hasMessage } from '@/features/auth/types';

import { messageToast } from '@/shared/utils';
import { errorMessageToast } from '@/shared/utils/errorMessageToast';

type LoginMutationInputType = {
  values: LoginDto;
  recaptcha: string;
};

export function useLoginMutation(
  setIsShowTwoFactor: Dispatch<SetStateAction<boolean>>,
) {
  const router = useRouter();
  const { mutate: login, isPending: isLoadingLogin } = useMutation({
    mutationKey: ['login user'],
    mutationFn: ({ values, recaptcha }: LoginMutationInputType) =>
      authService.login(values, recaptcha),
    onSuccess: (data) => {
      if (hasMessage(data)) {
        messageToast(data);
        setIsShowTwoFactor(true);
      } else {
        toast.success('Logged in', {
          description: 'You are successfully logged in.',
        });
        router.push('/dashboard/settings');
      }
    },
    onError: (error: unknown) => {
      errorMessageToast(error);
    },
  });

  return { login, isLoadingLogin };
}
