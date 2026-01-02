import { FetchClient } from '@/shared/utils';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!baseUrl) {
  throw new Error('API base URL is not defined in environment variables');
}

export const api = new FetchClient({
  baseUrl,
  options: {
    credentials: 'include',
  },
});
