/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      }
    ],
  },
  experimental: {
    appDir: true,
  },
	async redirects() {
    return [
      {
        source: '/',
        destination: '/s/projects',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
