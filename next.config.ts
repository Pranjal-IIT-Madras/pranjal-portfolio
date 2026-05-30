import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
      { protocol: 'https', hostname: 'raw.githubusercontent.com' },
      { protocol: 'https', hostname: 'github-readme-stats.vercel.app' },
      { protocol: 'https', hostname: 'ghchart.rshah.org' },
    ],
  },

  // Three.js and related packages must be transpiled for Next.js App Router
  transpilePackages: [
    'three',
    '@react-three/fiber',
    '@react-three/drei',
    '@react-three/postprocessing',
    'postprocessing',
    'maath',
  ],

  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion', 'gsap'],
  },

  // Webpack config to handle shader files and other assets
  webpack(config) {
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      exclude: /node_modules/,
      use: 'raw-loader',
    })
    return config
  },
}

export default nextConfig
