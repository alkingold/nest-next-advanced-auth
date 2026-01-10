'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTheme } from 'next-themes';
import { useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { AuthWrapper } from '@/features/auth/components';
import { THEME_DARK, THEME_LIGHT } from '@/features/auth/constants';
import { usePasswordRecoveryMutation } from '@/features/auth/hooks';
import {
  PasswordRecoverySchema,
  PasswordRecoverySchemaType,
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

export function ResetPasswordForm() {
  const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null);
  const { resolvedTheme } = useTheme();

  const form = useForm<PasswordRecoverySchemaType>({
    resolver: zodResolver(PasswordRecoverySchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
    },
  });

  const { resetPassword, isLoadingResetPassword } =
    usePasswordRecoveryMutation();

  const onSubmit = (values: PasswordRecoverySchemaType) => {
    if (!recaptchaValue) {
      toast.error('reCAPTCHA verification is required');
      return;
    }

    resetPassword({ values, recaptcha: recaptchaValue });
  };

  return (
    <AuthWrapper
      heading='Reset Password'
      description='Please enter your email to reset password'
      backButtonLabel='Go to login'
      backButtonHref='/auth/login'
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='grid gap-2 space-y-2'
        >
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    autoComplete='email'
                    disabled={isLoadingResetPassword}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className='flex justify-center'>
            <ReCAPTCHA
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''}
              onChange={setRecaptchaValue}
              theme={resolvedTheme === THEME_DARK ? THEME_DARK : THEME_LIGHT}
            />
          </div>
          <Button
            type='submit'
            disabled={
              !form.formState.isValid ||
              form.formState.isSubmitting ||
              !recaptchaValue ||
              isLoadingResetPassword
            }
          >
            {form.formState.isSubmitting ? 'Resetting...' : 'Reset'}
            Reset
          </Button>
        </form>
      </Form>
    </AuthWrapper>
  );
}
