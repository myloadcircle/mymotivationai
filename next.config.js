/** @type {import('next').NextConfig} */
const isHybridApp = process.env.NEXT_PUBLIC_IS_HYBRID_APP === 'true';

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Enable static export only for hybrid app builds
  output: isHybridApp ? 'export' : undefined,
  trailingSlash: isHybridApp,
  images: {
    domains: ['localhost', 'mymotivationai.com', 'www.mymotivationai.com', 'api.mymotivationai.com'],
    formats: ['image/avif', 'image/webp'],
    unoptimized: isHybridApp, // Required for static export
  },
  // Production domain configuration
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
    NEXT_PUBLIC_IS_HYBRID_APP: process.env.NEXT_PUBLIC_IS_HYBRID_APP || 'false',
  },
  // Security headers (only for web, not for hybrid app)
  ...(!isHybridApp && {
    async headers() {
      return [
        {
          source: '/(.*)',
          headers: [
            {
              key: 'X-DNS-Prefetch-Control',
              value: 'on'
            },
            {
              key: 'Strict-Transport-Security',
              value: 'max-age=63072000; includeSubDomains; preload'
            },
            {
              key: 'X-Content-Type-Options',
              value: 'nosniff'
            },
            {
              key: 'X-Frame-Options',
              value: 'SAMEORIGIN'
            },
            {
              key: 'X-XSS-Protection',
              value: '1; mode=block'
            },
            {
              key: 'Referrer-Policy',
              value: 'origin-when-cross-origin'
            },
            {
              key: 'Permissions-Policy',
              value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()'
            }
          ],
        },
      ]
    },
  }),
  // CORS configuration for API routes (only for web)
  ...(!isHybridApp && {
    async rewrites() {
      return [
        {
          source: '/api/:path*',
          destination: '/api/:path*',
        },
      ]
    },
  }),
}

const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
  // PWA configuration
  runtimeCaching: [
    {
      urlPattern: /^https?.*/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'offlineCache',
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        },
      },
    },
  ],
})

module.exports = withPWA(nextConfig)