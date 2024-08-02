import withBundleAnalyzer from '@next/bundle-analyzer'

const withBundleAnalyzerWithConfig = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const nextConfig = {}

export default withBundleAnalyzerWithConfig(nextConfig)
