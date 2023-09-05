/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  experimental: {
    mdxRs: true,
    serverActions: true,
  },
  images: {
    domains: [
      'maps.googleapis.com',
      'source.unsplash.com',
      'www.gravatar.com',
      'imagedelivery.net',
      'images.clerk.dev',
      'gravatar.com',
      'www.monote.ai',
      'monote.ai',
      'monote-*-darasus-team.vercel.app',
      'localhost',
    ],
  },
  transpilePackages: [
    'api',
    'auth-features',
    'card-features',
    'cards',
    'client-env',
    'config',
    'database',
    'email',
    'error',
    'hooks',
    'inngest-client',
    'lib',
    'server-env',
    'stripe-webhook-input-validation',
    'tokens',
    'types',
    'ui',
    'utils',
  ],
  webpack(config) {
    config.experiments = {
      asyncWebAssembly: true,
      layers: true,
    };

    config.module.rules.unshift({
      test: /pdf\.worker\.(min\.)?js/,
      use: [
        {
          loader: 'file-loader',
          options: {
            name: '[contenthash].[ext]',
            publicPath: '_next/static/worker',
            outputPath: 'static/worker',
          },
        },
      ],
    });

    return config;
  },
  async redirects() {
    return [
      {
        source: '/dashboard',
        destination: '/dashboard/all',
        permanent: true,
      },
    ];
  },
};
