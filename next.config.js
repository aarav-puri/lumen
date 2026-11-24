/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.openfoodfacts.org',
      },
      {
        protocol: 'https',
        hostname: 'world.openfoodfacts.org',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/avatars/**',
      },
    ],
  },
}

module.exports = nextConfig

// Lets `next dev` use Cloudflare bindings. Production runs on Cloudflare Workers via OpenNext.
require('@opennextjs/cloudflare').initOpenNextCloudflareForDev()
