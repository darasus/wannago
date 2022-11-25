module.exports = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
    swcPlugins: [
      [
        'next-superjson-plugin',
        {
          excluded: [],
        },
      ],
    ],
  },
  images: {
    domains: ['maps.googleapis.com', 'source.unsplash.com', 'www.gravatar.com'],
  },
};
