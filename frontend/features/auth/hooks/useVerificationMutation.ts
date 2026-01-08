import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { verificationService } from '@/features/auth/services';
import { VerificationTokenType } from '@/features/auth/types';

export function useVerificationMutation() {
  const router = useRouter();

  const { mutate: confirmEmail } = useMutation({
    mutationKey: ['email-verification'],
    mutationFn: (token: VerificationTokenType) =>
      verificationService.confirmEmailByToken(token),
    onSuccess: () => {
      toast.success('Email confirmation is completed');
      router.push('/dashboard/settings');
    },
    onError: () => {
      toast.error('Verification link is invalid or expired');
      router.push('/auth/login');
    },
  });

  return { confirmEmail };
}
