/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  redirects: () => [{
    source: '/',
    destination: '/home',
    permanent: true,
  },],
}

module.exports = nextConfig
