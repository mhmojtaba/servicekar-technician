/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  output: "export",
  basePath: "/technician",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
