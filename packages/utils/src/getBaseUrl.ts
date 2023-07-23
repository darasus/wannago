export const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }

  if (process.env.NEXT_PUBLIC_VERCEL_ENV === 'production') {
    return 'https://www.wannago.app';
  }

  if (process.env.NEXT_PUBLIC_VERCEL_ENV === 'development') {
    return 'http://localhost:3000';
  }

  return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
};
