const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

/** @type {import('next').NextConfig} */
const moduleExports = {
  reactStrictMode: true,
  experimental: {
    mdxRs: true,
  },
  images: {
    remotePatterns: [
      {
        hostname: '*.public.blob.vercel-storage.com',
      },
      {
        hostname: 'maps.googleapis.com',
      },
      {
        hostname: 'wannago-*-darasus-team.vercel.app',
      },
      {
        hostname: 'localhost',
      },
    ],
  },
  transpilePackages: [
    'api',
    'features',
    'env',
    'config',
    'database',
    'email',
    'error',
    'hooks',
    'inngest-client',
    'lib',
    'ui',
    'utils',
  ],
  env: {
    NEXT_PUBLIC_VERCEL_BRANCH_URL: process.env.VERCEL_BRANCH_URL,
    NEXT_PUBLIC_VERCEL_URL: process.env.VERCEL_URL,
    NEXT_PUBLIC_GOOGLE_OAUTH_SET_UP:
      Boolean(process.env.OAUTH_GOOGLE_CLIENT_ID) &&
      Boolean(process.env.OAUTH_GOOGLE_CLIENT_SECRET)
        ? 'true'
        : 'false',
  },
  async redirects() {
    return [
      {
        source: '/events',
        destination: '/events/all',
        permanent: true,
      },
    ];
  },
};

module.exports = withMDX(moduleExports);
