// This file sets a custom webpack configuration to use your Next.js app
// with Sentry.
// https://nextjs.org/docs/api-reference/next.config.js/introduction
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

const {withSentryConfig} = require('@sentry/nextjs');
const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    // If you use remark-gfm, you'll need to use next.config.mjs
    // as the package is ESM only
    // https://github.com/remarkjs/remark-gfm#install
    remarkPlugins: [],
    rehypePlugins: [],
    // If you use `MDXProvider`, uncomment the following line.
    // providerImportSource: "@mdx-js/react",
  },
});

/** @type {import('next').NextConfig} */
const moduleExports = {
  // Your existing module.exports

  sentry: {
    // Use `hidden-source-map` rather than `source-map` as the Webpack `devtool`
    // for client-side builds. (This will be the default starting in
    // `@sentry/nextjs` version 8.0.0.) See
    // https://webpack.js.org/configuration/devtool/ and
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/#use-hidden-source-map
    // for more information.
    hideSourceMaps: true,
  },
  reactStrictMode: true,
  pageExtensions: ['page.tsx', 'page.ts', 'page.mdx', 'api.ts', 'api.tsx'],
  images: {
    domains: [
      'maps.googleapis.com',
      'source.unsplash.com',
      'www.gravatar.com',
      'imagedelivery.net',
      'images.clerk.dev',
      'gravatar.com',
      'www.wannago.app',
    ],
  },
  transpilePackages: [
    'database',
    'client-env',
    'server-env',
    'email',
    'utils',
    'hooks',
    'lib',
    'trpc',
    'cards',
    'ui',
  ],
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

// Make sure adding Sentry options is the last code to run before exporting, to
// ensure that your source maps include changes from all other Webpack plugins
module.exports = withMDX(
  withSentryConfig(moduleExports, {
    // Additional config options for the Sentry Webpack plugin. Keep in mind that
    // the following options are set automatically, and overriding them is not
    // recommended:
    //   release, url, org, project, authToken, configFile, stripPrefix,
    //   urlPrefix, include, ignore
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options.
    silent: true,
  })
);
