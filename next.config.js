module.exports = {
  reactStrictMode: true,
  experimental: {
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
    domains: [
      'maps.googleapis.com',
      'source.unsplash.com',
      'www.gravatar.com',
      'imagedelivery.net',
    ],
  },
};
