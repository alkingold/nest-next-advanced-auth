/* eslint-disable */

import { Body, Heading, Link, Tailwind, Text } from "@react-email/components";
import { Html } from "@react-email/html";

interface ConfirmationTemplateProps {
  domain: string;
  token: string;
}

export function ConfirmationTemplate({
  domain,
  token,
}: ConfirmationTemplateProps) {
  const confirmLink = `${domain}/auth/new-verification?token=${token}`;

  return (
    <Html>
      <Tailwind>
        <Body className="text-black">
          <Heading>Please confirm your email</Heading>
          <Text>
            Hello! To confirm your email address, please follow this link:
          </Text>
          <Link href={confirmLink}>Confirm email</Link>
          <Text>
            This link will be valid during 1 hour. If you did not ask for the confirmation, please ignore this email.
          </Text>
          <Text>Thank you for using our service!</Text>
        </Body>
      </Tailwind>
    </Html>
  )
}
