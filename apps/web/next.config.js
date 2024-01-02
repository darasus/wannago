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
    domains: [
      'maps.googleapis.com',
      'source.unsplash.com',
      'www.gravatar.com',
      'imagedelivery.net',
      'images.clerk.dev',
      'gravatar.com',
      'www.wannago.app',
      '*.public.blob.vercel-storage.com',
      'wannago.app',
      'wannago-*-darasus-team.vercel.app',
      'localhost',
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
