/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  basePath: process.env.GITHUB_PAGES === 'true' ? '/clutch-lease-calculator' : '',
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
