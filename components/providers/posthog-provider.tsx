'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import posthog from 'posthog-js'

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
        api_host: 'https://eu.posthog.com',
        person_profiles: 'identified_only',
        capture_pageview: false, // We'll capture manually
        capture_pageleave: process.env.NODE_ENV === 'production', // Only in production
        disable_session_recording: process.env.NODE_ENV === 'development', // Disable in dev
        loaded: (posthog) => {
          if (process.env.NODE_ENV === 'development') {
            posthog.debug()
            // Disable some features in development to reduce errors
            posthog.opt_out_capturing()
          }
        },
      })
    }
  }, [])

  useEffect(() => {
    if (pathname && typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
      let url = window.origin + pathname
      if (searchParams && searchParams.toString()) {
        url = url + '?' + searchParams.toString()
      }
      
      posthog.capture('$pageview', {
        $current_url: url,
      })
    }
  }, [pathname, searchParams])

  return <>{children}</>
}

// Hook for using PostHog in components
export function usePostHog() {
  return posthog
}