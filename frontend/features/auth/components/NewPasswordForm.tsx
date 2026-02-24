'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTheme } from 'next-themes';
import { useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { AuthWrapper } from '@/features/auth/components/AuthWrapper';
import { THEME_DARK, THEME_LIGHT } from '@/features/auth/constants';
import { useNewPasswordMutation } from '@/features/auth/hooks';
import {
  NewPasswordSchema,
  NewPasswordSchemaType,
} from '@/features/auth/schemas';

import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  Input,
} from '@/shared/components/ui';

export function NewPasswordForm() {
  const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null);
  const { resolvedTheme } = useTheme();

  const form = useForm<NewPasswordSchemaType>({
    resolver: zodResolver(NewPasswordSchema),
    mode: 'onChange',
    defaultValues: {
      password: '',
    },
  });

  const { createNewPassword, isLoadingNewPassword } = useNewPasswordMutation();

  const onSubmit = (values: NewPasswordSchemaType) => {
    if (!recaptchaValue) {
      toast.error('reCAPTCHA verification is required');
      return;
    }

    createNewPassword({ values, recaptcha: recaptchaValue });
  };

  return (
    <AuthWrapper
      heading='Create New Password'
      description='Please enter your new password'
      backButtonLabel='Back to login'
      backButtonHref='/auth/login'
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='grid gap-2 space-y-2'
        >
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input
                    type='password'
                    {...field}
                    placeholder='******'
                    disabled={isLoadingNewPassword}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <div>
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
              isLoadingNewPassword
            }
          >
            {form.formState.isSubmitting ? 'Creating...' : 'Create'}
          </Button>
        </form>
      </Form>
    </AuthWrapper>
  );
}
