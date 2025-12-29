import Link from 'next/link';
import { type PropsWithChildren } from 'react';

import AuthSocial from '@/features/auth/components/AuthSocial';

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui';

interface AuthWrapperProps {
  heading: string;
  description?: string;
  backButtonLabel?: string;
  backButtonHref?: string;
  isShowSocialAuth?: boolean;
}

const AuthWrapper = ({
  children,
  heading,
  description,
  backButtonLabel,
  backButtonHref,
  isShowSocialAuth = false,
}: PropsWithChildren<AuthWrapperProps>) => {
  return (
    <Card className='w-full max-w-[400px]'>
      <CardHeader className='space-y-2'>
        <CardTitle>{heading}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        {isShowSocialAuth && <AuthSocial />}
        {children}
      </CardContent>
      <CardFooter>
        {backButtonLabel && backButtonHref && (
          <Button asChild variant='link' className='w-full font-normal'>
            <Link href={backButtonHref}>{backButtonLabel}</Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default AuthWrapper;
