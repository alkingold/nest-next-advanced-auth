'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { IUser } from '@/features/auth/types';
import { useUpdateProfileMutation } from '@/features/user/hooks/useUpdateProfileMutation';
import { SettingsSchema, SettingsSchemaType } from '@/features/user/schemas';

import {
  Button,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Switch,
} from '@/shared/components/ui';

type SettingsFormProps = {
  user: IUser;
};

export function SettingsForm({ user }: SettingsFormProps) {
  const { updateProfile, isUpdateProfileLoading } = useUpdateProfileMutation();
  const form = useForm<SettingsSchemaType>({
    resolver: zodResolver(SettingsSchema),
    mode: 'onChange',
    defaultValues: {
      name: user.displayName || '',
      email: user.email || '',
      isTwoFactorEnabled: user.isTwoFactorEnabled,
    },
  });

  const onSubmit = (values: SettingsSchemaType) => {
    updateProfile({ values });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='grid gap-2 space-y-2'
      >
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={isUpdateProfileLoading}
                  placeholder='FirstName LastName'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={isUpdateProfileLoading}
                  placeholder='email@mail.com'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='isTwoFactorEnabled'
          render={({ field }) => (
            <FormItem className='flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm'>
              <div className='space-y-0.5'>
                <FormLabel>Two factor authentication</FormLabel>
                <FormDescription>
                  {user.isTwoFactorAvailable
                    ? 'Turn on two-factor authentication for your profile'
                    : 'Two-factor authentication is not available for this account'}
                </FormDescription>
              </div>
              <FormControl className='z-50'>
                <Switch
                  checked={user.isTwoFactorAvailable ? field.value : false}
                  onCheckedChange={field.onChange}
                  disabled={
                    !user.isTwoFactorAvailable || isUpdateProfileLoading
                  }
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type='submit' disabled={isUpdateProfileLoading}>
          Save changes
        </Button>
      </form>
    </Form>
  );
}
