import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { authService } from '@/features/auth/services';

import { errorMessageToast } from '@/shared/utils';

export default function useLogoutMutation() {
  const router = useRouter();

  const { mutate: logout, isPending: isLoadingLogout } = useMutation({
    mutationKey: ['logout'],
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      toast.success('Logged out', {
        description: 'You successfully logged out',
      });
      router.push('/auth/login');
    },
    onError: (error) => {
      errorMessageToast(error);
    },
  });

  return {
    logout,
    isLoadingLogout,
  };
}
