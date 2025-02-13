import withBundleAnalyzer from '@next/bundle-analyzer'
import { NextConfig } from 'next'

const withBundleAnalyzerWithConfig = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

const nextConfig: NextConfig = {
  experimental: {
    turbo: {},
  },
}

export default withBundleAnalyzerWithConfig(nextConfig)
