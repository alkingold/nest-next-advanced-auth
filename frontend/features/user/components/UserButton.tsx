'use client';

import { useState } from 'react';
import { LuLogOut } from 'react-icons/lu';

import useLogoutMutation from '@/features/auth/hooks/useLogoutMutation';
import { IUser } from '@/features/auth/types';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Skeleton,
} from '@/shared/components/ui';

type UserButtonProps = {
  user: IUser;
};

function UserButton({ user }: UserButtonProps) {
  const { logout, isLoadingLogout } = useLogoutMutation();
  const [imageLoaded, setImageLoaded] = useState(false);

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage
            src={user.picture ?? undefined}
            alt={user.displayName}
            referrerPolicy='no-referrer'
            onLoadingStatusChange={(status) => {
              if (status === 'loaded') setImageLoaded(true);
            }}
          />
          {!imageLoaded && (
            <AvatarFallback>{user.displayName.slice(0, 1)}</AvatarFallback>
          )}
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-40' align='end'>
        <DropdownMenuItem disabled={isLoadingLogout} onClick={() => logout()}>
          <LuLogOut className='mr-2 size-4' />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function UserButtonLoading() {
  return <Skeleton className='h-10 w-10 rounded-full' />;
}

export default UserButton;
