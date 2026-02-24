import { useMutation } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

import { NewPasswordSchemaType } from '@/features/auth/schemas';
import { passwordRecoveryService } from '@/features/auth/services';

import { errorMessageToast } from '@/shared/utils';

type NewPasswordMutationInputType = {
  values: NewPasswordSchemaType;
  recaptcha?: string;
};

export function useNewPasswordMutation() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const { mutate: createNewPassword, isPending: isLoadingNewPassword } =
    useMutation({
      mutationKey: ['new password'],
      mutationFn: ({ values, recaptcha }: NewPasswordMutationInputType) =>
        passwordRecoveryService.createNewPassword(values, token, recaptcha),
      onSuccess: () => {
        toast.success('Password changed', {
          description: 'Your can now enter your account',
        });
        router.push('/dashboard/settings');
      },
      onError: (error: unknown) => {
        errorMessageToast(error);
      },
    });

  return { createNewPassword, isLoadingNewPassword };
}
