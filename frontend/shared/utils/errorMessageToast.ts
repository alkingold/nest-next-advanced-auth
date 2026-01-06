import { toast } from 'sonner';

export function errorMessageToast(error: unknown) {
  if (error instanceof Error && error.message) {
    const [title, ...rest] = error.message.split('. ');
    const description = rest.join('. ').trim();

    if (description) {
      toast.error(title, { description });
    } else {
      toast.error(title);
    }
  } else {
    toast.error('Unexpected error occurred.');
  }
}
