import { toast } from 'sonner';

import { AuthActionType } from '@/features/auth/types';

export function messageToast(data: AuthActionType) {
  const [title, ...rest] = data.message.split('. ');
  const description = rest.join('. ').trim();

  if (description) {
    toast.info(title, { description });
  } else {
    toast.info(title);
  }
}
