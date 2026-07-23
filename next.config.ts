import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

// Security HTTP Headers applied to every response
const securityHeaders = [
  // Prevent clickjacking
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  // Block MIME sniffing
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // Referrer policy for privacy
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // Disable DNS prefetching
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  // Permissions policy — restrict sensitive browser features
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(self), interest-cohort=()',
  },
  // Strict Transport Security (HSTS) — only effective over HTTPS
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  // Content Security Policy
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      // Scripts: self + Next.js inline scripts (via nonce in prod you'd use a nonce; for now unsafe-inline for HMR/Next.js)
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://accounts.google.com",
      // Styles: self + inline (needed by Next.js, Tailwind)
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      // Fonts
      "font-src 'self' https://fonts.gstatic.com data:",
      // Images: self + data URIs + Google avatars + Unsplash + UI Avatars + OpenStreetMap + unpkg (leaflet icons)
      "img-src 'self' data: blob: https://lh3.googleusercontent.com https://ui-avatars.com https://images.unsplash.com https://*.tile.openstreetmap.org https://unpkg.com https://luxeimmo.com",
      // Connections: self + Google OAuth + NextAuth
      "connect-src 'self' https://accounts.google.com https://oauth2.googleapis.com",
      // Frames: Google OAuth popup
      "frame-src 'self' https://accounts.google.com",
      // Objects: none
      "object-src 'none'",
      // Base URI: only self
      "base-uri 'self'",
      // Form action: only self
      "form-action 'self' https://accounts.google.com",
    ].join('; '),
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'ui-avatars.com' },
      // Development: allow next/image to optimize local uploads served from localhost
      { protocol: 'http', hostname: 'localhost' },
    ],
    formats: ['image/avif', 'image/webp'],
    // Allow unoptimized local paths (e.g. /uploads/*) served directly as <img> tags
    // without going through the /_next/image optimizer
    unoptimized: process.env.NODE_ENV === 'development',
  },

  cacheComponents: true,
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  swcMinify: false,
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  // Apply security headers globally
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },

  // Redirect www → apex (useful for production Vercel/Nginx setup)
  async redirects() {
    return [];
  },
};

export default withNextIntl(nextConfig);
