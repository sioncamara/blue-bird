/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  // logging: {
  //     fetches: {
  //       fullUrl: true,
  //     },
  //   },
  images: {
    remotePatterns: [
      {
        hostname: "avatars.githubusercontent.com",
      },
    ],
  },
}

export default nextConfig
