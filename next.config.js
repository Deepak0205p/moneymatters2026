/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  experimental: {
    webpackBuildWorker: true,
  },
  // Exclude backup folder from compilation
  webpack: (config, { dir }) => {
    config.watchOptions = {
      ...config.watchOptions,
      ignored: /mvpppp/,
    };
    return config;
  },
};

export default nextConfig;
