import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { PasswordRecoverySchemaType } from '@/features/auth/schemas';
import { passwordRecoveryService } from '@/features/auth/services';

import { errorMessageToast } from '@/shared/utils';

type PasswordRecoveryMutationInputType = {
  values: PasswordRecoverySchemaType;
  recaptcha?: string;
};

export function usePasswordRecoveryMutation() {
  const { mutate: resetPassword, isPending: isLoadingResetPassword } =
    useMutation({
      mutationKey: ['reset password'],
      mutationFn: ({ values, recaptcha }: PasswordRecoveryMutationInputType) =>
        passwordRecoveryService.reset(values, recaptcha),
      onSuccess: () => {
        toast.success('Please check your email', {
          description: 'A confirmation link was sent to your email',
        });
      },
      onError: (error: unknown) => {
        errorMessageToast(error);
      },
    });

  return { resetPassword, isLoadingResetPassword };
}
