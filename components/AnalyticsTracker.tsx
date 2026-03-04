'use client'

import { useEffect } from 'react'
import { trackEvent, trackPageView, trackConversionFunnel } from '@/lib/analytics'

interface AnalyticsTrackerProps {
  qrData: any
}

export default function AnalyticsTracker({ qrData }: AnalyticsTrackerProps) {
  useEffect(() => {
    // Track page view
    trackPageView('/qr-landing', qrData)

    // Track conversion funnel entry
    trackConversionFunnel('landing_view', {
      ...qrData,
      timestamp: new Date().toISOString(),
      referrer: document.referrer || 'direct'
    })

    // Set up visibility change tracking
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        trackEvent('page_hidden', {
          ...qrData,
          timeOnPage: Math.round((Date.now() - pageLoadTime) / 1000),
          timestamp: new Date().toISOString()
        })
      }
    }

    const pageLoadTime = Date.now()
    document.addEventListener('visibilitychange', handleVisibilityChange)

    // Track time on page before unload
    const handleBeforeUnload = () => {
      trackEvent('page_unload', {
        ...qrData,
        timeOnPage: Math.round((Date.now() - pageLoadTime) / 1000),
        timestamp: new Date().toISOString()
      })
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    // Track scroll depth
    const trackScrollDepth = () => {
      const scrollPosition = window.scrollY
      const pageHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercentage = Math.round((scrollPosition / pageHeight) * 100)

      // Track at 25%, 50%, 75%, 100% scroll
      const milestones = [25, 50, 75, 100]
      milestones.forEach(milestone => {
        if (scrollPercentage >= milestone && scrollPercentage < milestone + 5) {
          trackEvent(`scroll_depth_${milestone}`, {
            ...qrData,
            scrollPercentage,
            timestamp: new Date().toISOString()
          })
        }
      })
    }

    // Throttle scroll tracking
    let scrollTimeout: NodeJS.Timeout
    const handleScroll = () => {
      if (scrollTimeout) clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(trackScrollDepth, 500)
    }

    window.addEventListener('scroll', handleScroll)

    // Track interaction events
    const trackInteractions = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (target.tagName === 'BUTTON' || target.tagName === 'A') {
        const text = target.textContent?.trim() || target.getAttribute('aria-label') || 'unknown'
        trackEvent('interaction_click', {
          ...qrData,
          element: target.tagName,
          text: text.substring(0, 50),
          timestamp: new Date().toISOString()
        })
      }
    }

    document.addEventListener('click', trackInteractions)

    // Cleanup
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('beforeunload', handleBeforeUnload)
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('click', trackInteractions)
      if (scrollTimeout) clearTimeout(scrollTimeout)
    }
  }, [qrData])

  // This component doesn't render anything visible
  return null
}