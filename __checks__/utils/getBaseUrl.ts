export function getBaseUrl() {
  return (
    process.env.ENVIRONMENT_URL ||
    `https://${process.env.NEXT_PUBLIC_PREVIEW_VERCEL_URL}`
  );
}
