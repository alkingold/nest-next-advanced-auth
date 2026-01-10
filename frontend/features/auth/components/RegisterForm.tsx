'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTheme } from 'next-themes';
import { useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { THEME_DARK, THEME_LIGHT } from '@/features/auth/constants';
import { useRegisterMutation } from '@/features/auth/hooks';
import { RegisterSchema, RegisterSchemaType } from '@/features/auth/schemas';

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

import { AuthWrapper } from './AuthWrapper';

export const RegisterForm = () => {
  const { resolvedTheme } = useTheme();
  const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null);
  const form = useForm<RegisterSchemaType>({
    resolver: zodResolver(RegisterSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      password: '',
      passwordRepeat: '',
    },
  });

  const { register, isLoadingRegister } = useRegisterMutation();

  const onSubmit = (values: RegisterSchemaType) => {
    if (!recaptchaValue) {
      toast.error('reCAPTCHA verification is required.');
      return;
    }

    register({ values, recaptcha: recaptchaValue });
  };

  return (
    <AuthWrapper
      heading='Register'
      description='Create new account'
      backButtonLabel='Back to Login'
      backButtonHref='/auth/login'
      isShowSocialAuth={true}
    >
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
                    placeholder='Your name'
                    autoComplete='name'
                    disabled={isLoadingRegister}
                    {...field}
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
                    type='email'
                    autoComplete='email'
                    placeholder='Your email'
                    disabled={isLoadingRegister}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type='password'
                    autoComplete='new-password'
                    placeholder='******'
                    disabled={isLoadingRegister}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='passwordRepeat'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm password</FormLabel>
                <FormControl>
                  <Input
                    type='password'
                    autoComplete='new-password'
                    placeholder='******'
                    disabled={isLoadingRegister}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className='flex justify-center'>
            <ReCAPTCHA
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''}
              onChange={(value) => setRecaptchaValue(value)}
              theme={resolvedTheme === THEME_DARK ? THEME_DARK : THEME_LIGHT}
            />
          </div>
          <Button
            type='submit'
            disabled={
              !form.formState.isValid ||
              form.formState.isSubmitting ||
              !recaptchaValue ||
              isLoadingRegister
            }
          >
            {form.formState.isSubmitting
              ? 'Creating account...'
              : 'Create account'}
          </Button>
        </form>
      </Form>
    </AuthWrapper>
  );
};
