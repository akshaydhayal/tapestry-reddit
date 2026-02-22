/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  transpilePackages: [
    '@noble/hashes',
    '@noble/curves',
    '@solana/web3.js'
  ],
}

export default nextConfig
