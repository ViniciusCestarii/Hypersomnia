import withBundleAnalyzer from '@next/bundle-analyzer'

const withBundleAnalyzerWithConfig = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: {},
  },
}

export default withBundleAnalyzerWithConfig(nextConfig)
