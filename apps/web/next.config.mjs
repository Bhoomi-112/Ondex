/** @type {import('next').NextConfig} */
<<<<<<< HEAD
const nextConfig = {};
=======
const nextConfig = {
  transpilePackages: ["@ondex/sdk", "@ondex/ui"],
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:3001/api/:path*",
      },
    ];
  },
};
>>>>>>> b2133f6 (Initial frontend setup)

export default nextConfig;
