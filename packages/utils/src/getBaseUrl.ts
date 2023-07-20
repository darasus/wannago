export const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }

  if (process.env.VERCEL_BRANCH_URL?.includes('test-automation')) {
    return process.env.VERCEL_BRANCH_URL;
  }

  if (process.env.IS_CHECKLY === 'true' && process.env.ENVIRONMENT_URL) {
    return process.env.ENVIRONMENT_URL;
  }

  if (process.env.NEXT_PUBLIC_VERCEL_ENV === 'production') {
    return `https://www.wannago.app`;
  }

  if (process.env.NEXT_PUBLIC_VERCEL_ENV === 'development') {
    return `http://localhost:3000`;
  }

  const url = process.env.NEXT_PUBLIC_VERCEL_URL;

  return url?.startsWith('http') ? url : `https://${url}`;
};
