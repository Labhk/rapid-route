/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.module.rules.push({
      test: /\.html$/,
      loader: 'html-loader',
    });
    return config;
  },
};

module.exports = nextConfig;