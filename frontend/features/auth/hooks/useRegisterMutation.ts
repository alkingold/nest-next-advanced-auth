import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { RegisterDto } from '@/features/auth/dtos';
import { authService } from '@/features/auth/services';
import { hasMessage } from '@/features/auth/types/auth.guards';

import { messageToast } from '@/shared/utils';
import { errorMessageToast } from '@/shared/utils/errorMessageToast';

type RegisterMutationInputType = {
  values: RegisterDto;
  recaptcha: string;
};

export function useRegisterMutation() {
  const { mutate: register, isPending: isLoadingRegister } = useMutation({
    mutationKey: ['register user'],
    mutationFn: ({ values, recaptcha }: RegisterMutationInputType) =>
      authService.register(values, recaptcha),
    onSuccess: (data) => {
      if (hasMessage(data)) {
        messageToast(data);
      } else {
        toast.success('Account created successfully!', {
          description: 'Please visit your mail to confirm your email address.',
        });
      }
    },
    onError: (error: unknown) => {
      errorMessageToast(error);
    },
  });

  return { register, isLoadingRegister };
}
