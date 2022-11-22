module.exports = {
  reactStrictMode: true,
  experimental: {
    runtime: 'experimental-edge',
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
