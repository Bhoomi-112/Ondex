/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@ondex/sdk"],
  images: {
    remotePatterns: [],
  },
};

export default nextConfig;
