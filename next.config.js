/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Exclude server-only packages from client bundle
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        'undici': false,
        'cheerio': false,
        'rss-parser': false,
      };
    }
    return config;
  },
}

module.exports = nextConfig
