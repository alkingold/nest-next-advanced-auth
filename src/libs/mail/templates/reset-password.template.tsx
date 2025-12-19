/* eslint-disable */

import {
  Body,
  Heading,
  Link,
  Tailwind,
  Text,
} from "@react-email/components";
import { Html } from "@react-email/html";

interface ResetPasswordTemplateProps {
  domain: string;
  token: string;
}

export function ResetPasswordTemplate({ domain, token }: ResetPasswordTemplateProps) {
  const resetLink = `${domain}/auth/new-password?token==${token}`;

  return (
    <Html>
      <Tailwind>
        <Body>
          <Heading>Reset Password</Heading>
          <Text>
            Hello! You have asked a password reset. Please, follow the link below to create a new password:
          </Text>
          <Link href={resetLink}>Confirm password reset</Link>
          <Text>
            This link will be valid during 1 hour. If you did not ask for password reset, please ignore this message.
          </Text>
        </Body>
      </Tailwind>
    </Html>
  )
}
