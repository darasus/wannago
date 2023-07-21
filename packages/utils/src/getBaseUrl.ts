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

  if (process.env.NEXT_PUBLIC_PREVIEW_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_PREVIEW_VERCEL_URL}`;
  }

  const url = process.env.NEXT_PUBLIC_VERCEL_URL;

  return url?.startsWith('http') ? url : `https://${url}`;
};
