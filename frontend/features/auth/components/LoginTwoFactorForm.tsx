'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import {
  LoginSchemaTwoFactor,
  LoginSchemaTwoFactorType,
} from '@/features/auth/schemas';

import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from '@/shared/components/ui';

type LoginTwoFactorFormProps = {
  login: (code: string) => void;
  isLoadingLogin: boolean;
};

export function LoginTwoFactorForm({
  login,
  isLoadingLogin,
}: LoginTwoFactorFormProps) {
  const form = useForm<LoginSchemaTwoFactorType>({
    resolver: zodResolver(LoginSchemaTwoFactor),
    mode: 'onChange',
    defaultValues: {
      code: '',
    },
  });

  const onSubmit = (values: LoginSchemaTwoFactorType) => {
    login(values.code);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='grid gap-2 space-y-2'
      >
        <FormField
          control={form.control}
          name='code'
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Please enter your two factor authentication code
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder='123456'
                  disabled={isLoadingLogin}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type='submit'
          disabled={
            !form.formState.isValid ||
            form.formState.isSubmitting ||
            isLoadingLogin
          }
        >
          {form.formState.isSubmitting ? 'Logging in...' : 'Login'}
        </Button>
      </form>
    </Form>
  );
}
