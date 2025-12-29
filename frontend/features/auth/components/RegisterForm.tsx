import AuthWrapper from '@/features/auth/components/AuthWrapper';

const RegisterForm = () => {
  return (
    <AuthWrapper
      heading='Register'
      description='Create new account'
      backButtonLabel='Back to Login'
      backButtonHref='/auth/login'
      isShowSocialAuth={true}
    >
      <div>RegisterForm</div>
    </AuthWrapper>
  );
};

export default RegisterForm;
