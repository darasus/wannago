export const getBaseUrl = () => {
  if (typeof window !== 'undefined') return '';

  const vc = process.env.VERCEL_URL;

  if (process.env.VERCEL_BRANCH_URL?.includes('test-automation')) {
    return process.env.VERCEL_BRANCH_URL;
  }

  if (vc) return `https://${vc}`;

  return `http://localhost:3000`;
};
