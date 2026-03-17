type ErrorProps = {
  message: string;
};

export function Error({ message }: ErrorProps) {
  return <p className='text-sm text-red-500'>{message}</p>;
}
