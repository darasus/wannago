export const getBaseUrl = () => {
  console.log({
    IS_CHECKLY: process.env.IS_CHECKLY,
    ENVIRONMENT_URL: process.env.ENVIRONMENT_URL,
    NEXT_PUBLIC_VERCEL_ENV: process.env.NEXT_PUBLIC_VERCEL_ENV,
    NEXT_PUBLIC_VERCEL_URL: process.env.NEXT_PUBLIC_VERCEL_URL,
  });
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }

  if (process.env.IS_CHECKLY === 'true' && process.env.ENVIRONMENT_URL) {
    return process.env.ENVIRONMENT_URL;
  }

  if (process.env.IS_CHECKLY === 'true') {
    return 'https://wannago-git-test-automation-darasus-team.vercel.app';
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
