'use client'

import { useEffect } from 'react'

const ServiceWorker = () => {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      registerServiceWorker()
    }
  }, [])

  async function registerServiceWorker() {
    await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
      updateViaCache: 'none',
    })
  }

  return null
}

export default ServiceWorker
