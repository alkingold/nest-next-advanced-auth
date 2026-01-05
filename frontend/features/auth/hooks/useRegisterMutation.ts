import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { RegisterDto } from '@/features/auth/dtos';
import { authService } from '@/features/auth/services';

import { toastMessageHandler } from '@/shared/utils/toastMessageHandler';

type RegisterMutationInputType = {
  values: RegisterDto;
  recaptcha: string;
};

export function useRegisterMutation() {
  const { mutate: register, isPending: isLoadingRegister } = useMutation({
    mutationKey: ['register user'],
    mutationFn: ({ values, recaptcha }: RegisterMutationInputType) =>
      authService.register(values, recaptcha),
    onSuccess: () => {
      toast.success('Account created successfully!', {
        description: 'Please visit your mail to confirm your email address.',
      });
    },
    onError: (error: unknown) => {
      toastMessageHandler(error);
    },
  });

  return { register, isLoadingRegister };
}
