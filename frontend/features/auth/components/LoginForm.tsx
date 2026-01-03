'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTheme } from 'next-themes';
import { useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

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

    console.log(values);
    toast.success('Logged in successfully! (not really, this is a demo)');
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
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} autoComplete='email' />
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
              theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
            />
          </div>
          <Button
            type='submit'
            disabled={
              !form.formState.isValid ||
              form.formState.isSubmitting ||
              !recaptchaValue
            }
          >
            {form.formState.isSubmitting ? 'Logging in...' : 'Login'}
          </Button>
        </form>
      </Form>
    </AuthWrapper>
  );
}
