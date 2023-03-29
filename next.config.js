/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['avatars.cloudflare.steamstatic.com', 'community.cloudflare.steamstatic.com'],
  },
}

module.exports = nextConfig
