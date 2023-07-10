export const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_VERCEL_ENV === 'production') {
    return `https://www.wannago.app`;
  }

  if (process.env.NEXT_PUBLIC_VERCEL_ENV === 'development') {
    return `http://localhost:3000`;
  }

  const url = process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL;

  console.log(
    'NEXT_PUBLIC_VERCEL_BRANCH_URL',
    process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL
  );

  return url?.startsWith('http') ? url : `https://${url}`;
};
