// Analytics tracking library for QR code landing page

// Configuration
const ANALYTICS_ENDPOINT = process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT || '/api/analytics'
const ENABLE_ANALYTICS = process.env.NODE_ENV === 'production' || true // Always enabled for demo

// Session management
let sessionId: string
let pageViewId: string

// Initialize session
const initializeSession = () => {
  if (typeof window === 'undefined') return

  // Get or create session ID
  sessionId = sessionStorage.getItem('analytics_session_id') || generateId()
  sessionStorage.setItem('analytics_session_id', sessionId)

  // Generate page view ID
  pageViewId = generateId()

  // Store session start time if not already set
  if (!sessionStorage.getItem('session_start_time')) {
    sessionStorage.setItem('session_start_time', Date.now().toString())
  }
}

// Generate unique ID
const generateId = (): string => {
  return 'id-' + Math.random().toString(36).substr(2, 9) + '-' + Date.now().toString(36)
}

// Get device information
const getDeviceInfo = () => {
  if (typeof window === 'undefined') return {}

  return {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    pixelRatio: window.devicePixelRatio,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    isStandalone: window.matchMedia('(display-mode: standalone)').matches,
    isIOS: /iPad|iPhone|iPod/.test(navigator.userAgent),
    isAndroid: /Android/.test(navigator.userAgent),
    isMobile: /Mobi|Android|iPhone|iPad|iPod/.test(navigator.userAgent)
  }
}

// Get QR code parameters from URL
const getQRCodeParams = () => {
  if (typeof window === 'undefined') return {}

  const urlParams = new URLSearchParams(window.location.search)
  const utmSource = urlParams.get('utm_source')
  const utmMedium = urlParams.get('utm_medium')
  const utmCampaign = urlParams.get('utm_campaign')
  const utmContent = urlParams.get('utm_content')
  const utmTerm = urlParams.get('utm_term')

  return {
    utm_source: utmSource,
    utm_medium: utmMedium,
    utm_campaign: utmCampaign,
    utm_content: utmContent,
    utm_term: utmTerm,
    is_qr_code: utmMedium === 'qr-code'
  }
}

// Send analytics event
const sendEvent = async (eventType: string, eventData: any = {}) => {
  if (!ENABLE_ANALYTICS) {
    console.log(`[Analytics] ${eventType}:`, eventData)
    return
  }

  // Initialize session if needed
  if (!sessionId) {
    initializeSession()
  }

  const eventPayload = {
    event_type: eventType,
    event_data: eventData,
    session_id: sessionId,
    page_view_id: pageViewId,
    timestamp: new Date().toISOString(),
    url: typeof window !== 'undefined' ? window.location.href : '',
    referrer: typeof window !== 'undefined' ? document.referrer : '',
    device: getDeviceInfo(),
    qr_params: getQRCodeParams(),
    // Add performance metrics if available
    performance: typeof window !== 'undefined' && 'performance' in window ? {
      timing: {
        navigationStart: performance.timing.navigationStart,
        loadEventEnd: performance.timing.loadEventEnd,
        domContentLoadedEventEnd: performance.timing.domContentLoadedEventEnd
      },
      memory: (performance as any).memory
    } : null
  }

  try {
    // In production, this would send to your analytics endpoint
    // For now, we'll log it and optionally send to a mock endpoint
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Analytics Event] ${eventType}:`, eventPayload)
    }

    // Send to analytics endpoint (mock implementation)
    await fetch(ANALYTICS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventPayload),
      keepalive: true // Ensure event is sent even if page is unloading
    }).catch(error => {
      console.warn('Failed to send analytics event:', error)
      // Fallback to localStorage for offline queuing
      queueEventForRetry(eventPayload)
    })
  } catch (error) {
    console.error('Error sending analytics event:', error)
  }
}

// Queue events for retry (offline support)
const queueEventForRetry = (eventPayload: any) => {
  if (typeof window === 'undefined') return

  try {
    const queuedEvents = JSON.parse(localStorage.getItem('analytics_queue') || '[]')
    queuedEvents.push({
      ...eventPayload,
      queued_at: new Date().toISOString()
    })
    localStorage.setItem('analytics_queue', JSON.stringify(queuedEvents.slice(-100))) // Keep last 100 events
  } catch (error) {
    console.error('Failed to queue analytics event:', error)
  }
}

// Retry queued events
const retryQueuedEvents = async () => {
  if (typeof window === 'undefined') return

  try {
    const queuedEvents = JSON.parse(localStorage.getItem('analytics_queue') || '[]')
    if (queuedEvents.length === 0) return

    console.log(`Retrying ${queuedEvents.length} queued analytics events`)

    for (const event of queuedEvents) {
      await fetch(ANALYTICS_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event)
      }).catch(error => {
        console.warn('Failed to retry queued event:', error)
        return // Keep event in queue for next retry
      })
    }

    // Clear successfully sent events
    localStorage.removeItem('analytics_queue')
  } catch (error) {
    console.error('Error retrying queued events:', error)
  }
}

// Public API

/**
 * Track a custom event
 */
export const trackEvent = (eventType: string, eventData: any = {}) => {
  sendEvent(eventType, eventData)
}

/**
 * Track page view
 */
export const trackPageView = (pagePath: string, additionalData: any = {}) => {
  initializeSession()
  
  const eventData = {
    page_path: pagePath,
    page_title: typeof document !== 'undefined' ? document.title : '',
    ...additionalData
  }

  sendEvent('page_view', eventData)
}

/**
 * Track conversion funnel step
 */
export const trackConversionFunnel = (step: string, stepData: any = {}) => {
  const funnelSteps = {
    'scan': 'QR code scanned',
    'landing_view': 'Landing page viewed',
    'install_click': 'Install button clicked',
    'install_complete': 'Installation completed',
    'app_launch': 'App launched from install',
    'onboarding_complete': 'Onboarding completed',
    'first_value': 'First value experienced',
    'subscription_start': 'Subscription started'
  }

  sendEvent('funnel_step', {
    step,
    step_name: funnelSteps[step as keyof typeof funnelSteps] || step,
    ...stepData
  })
}

/**
 * Track QR code scan
 */
export const trackQRScan = (qrData: any) => {
  sendEvent('qr_scan', {
    ...qrData,
    scan_timestamp: new Date().toISOString()
  })
}

/**
 * Track installation attempt
 */
export const trackInstallAttempt = (outcome: 'success' | 'failure' | 'dismissed', error?: string) => {
  sendEvent('install_attempt', {
    outcome,
    error,
    timestamp: new Date().toISOString(),
    device: getDeviceInfo(),
    qr_params: getQRCodeParams()
  })
}

/**
 * Track user engagement
 */
export const trackEngagement = (action: string, duration?: number, metadata?: any) => {
  sendEvent('engagement', {
    action,
    duration,
    ...metadata,
    timestamp: new Date().toISOString()
  })
}

/**
 * Initialize analytics
 */
export const initAnalytics = () => {
  if (typeof window === 'undefined') return

  initializeSession()
  
  // Retry any queued events
  if (navigator.onLine) {
    retryQueuedEvents()
  }

  // Set up online/offline detection
  window.addEventListener('online', retryQueuedEvents)

  // Track session start
  sendEvent('session_start', {
    session_start_time: sessionStorage.getItem('session_start_time'),
    device: getDeviceInfo(),
    qr_params: getQRCodeParams()
  })

  console.log('Analytics initialized')
}

// Initialize analytics on import in browser context
if (typeof window !== 'undefined') {
  // Wait for page to load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAnalytics)
  } else {
    initAnalytics()
  }
}