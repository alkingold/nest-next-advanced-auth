/* eslint-disable */

import { Body, Heading, Tailwind, Text } from "@react-email/components";
import { Html } from "@react-email/html";

interface TwoFactorAuthTemplateProps {
  token: string;
}

export function TwoFactorAuthTemplate({token}: TwoFactorAuthTemplateProps) {
  return (
    <Html>
      <Tailwind>
        <Body className='text-black'>
          <Heading>Two-factor authentication</Heading>
          <Text>Your two-factor authentication code: <strong>{token}</strong></Text>
          <Text>
            Please enter this code in the application to accomplish two factor authentication process.
          </Text>
          <Text>
            If you have not asked this code, just ignore this message.
          </Text>
        </Body>
      </Tailwind>
    </Html>
  )
}
