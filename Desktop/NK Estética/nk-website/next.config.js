const createNextIntlPlugin = require('next-intl/plugin');
const withNextIntl = createNextIntlPlugin('./i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    formats: ['image/webp'],
  },
  async redirects() {
    return [
      {
        source: '/escuela',
        destination: '/es/escuela',
        permanent: false,
      },
    ];
  },
};

module.exports = withNextIntl(nextConfig);
