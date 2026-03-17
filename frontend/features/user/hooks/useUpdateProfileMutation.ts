import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { UpdateProfileDto } from '@/features/user/dtos';
import { userService } from '@/features/user/services';

import { errorMessageToast } from '@/shared/utils';

type UpdateProfileInputType = {
  values: UpdateProfileDto;
};

export const useUpdateProfileMutation = () => {
  const { mutate: updateProfile, isPending: isUpdateProfileLoading } =
    useMutation({
      mutationKey: ['update profile'],
      mutationFn: ({ values }: UpdateProfileInputType) =>
        userService.updateProfile(values),
      onSuccess: () => {
        toast.success('Updated', {
          description: 'Your profile data was successfully updated',
        });
      },
      onError: (error) => {
        errorMessageToast(error);
      },
    });

  return { updateProfile, isUpdateProfileLoading };
};
