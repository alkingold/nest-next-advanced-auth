import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login',
  description: 'Log into your account',
};

export default function LoginPage() {
  return (
    <div>
      <h1>Login</h1>
      {/* Login form goes here */}
    </div>
  );
}
