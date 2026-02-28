'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { THEME_DARK, THEME_LIGHT } from '@/features/auth/constants';
import { useLoginMutation } from '@/features/auth/hooks';
import {
  LoginSchema,
  LoginSchemaType,
} from '@/features/auth/schemas/login.schema';

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

export function LoginForm() {
  const { resolvedTheme } = useTheme();
  const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null);
  const [isShowTwoFactor, setIsShowTwoFactor] = useState<boolean>(false);

  const { login, isLoadingLogin } = useLoginMutation(setIsShowTwoFactor);
  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (values: LoginSchemaType) => {
    if (!recaptchaValue) {
      toast.error('reCAPTCHA verification is required.');
      return;
    }

    login({ values, recaptcha: recaptchaValue });
  };

  return (
    <AuthWrapper
      heading='Welcome Back'
      description='Please sign in to your account'
      backButtonLabel="Don't have an account? Register"
      backButtonHref='/auth/register'
      isShowSocialAuth={true}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='grid gap-2 space-y-2'
        >
          {isShowTwoFactor ? (
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
                </FormItem>
              )}
            />
          ) : (
            <>
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <div className='flex items-center'>
                      <FormLabel>Email</FormLabel>
                      <Link
                        href='/auth/reset-password'
                        className='ml-auto inline-block text-sm underline'
                      >
                        Forgot your password ?
                      </Link>
                    </div>

                    <FormControl>
                      <Input
                        {...field}
                        autoComplete='email'
                        disabled={isLoadingLogin}
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
                        autoComplete='current-password'
                        disabled={isLoadingLogin}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

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
              isLoadingLogin
            }
          >
            {form.formState.isSubmitting ? 'Logging in...' : 'Login'}
          </Button>
        </form>
      </Form>
    </AuthWrapper>
  );
}
