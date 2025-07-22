/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  basePath: "/technician",
  assetPrefix: "/technician",
  output: "export",
  transpilePackages: ["@zxing/library"],
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
