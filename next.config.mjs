/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  basePath: "/servicekar/technician",
  assetPrefix: "/servicekar/technician",
  output: "export",
  transpilePackages: ["@zxing/library"],
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
