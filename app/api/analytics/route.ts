import { NextRequest, NextResponse } from 'next/server'

// Simple in-memory store for demo purposes
// In production, this would connect to a database
const analyticsStore: any[] = []

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // Add timestamp if not present
    if (!data.timestamp) {
      data.timestamp = new Date().toISOString()
    }
    
    // Add server-side metadata
    const enrichedData = {
      ...data,
      server_timestamp: new Date().toISOString(),
      ip: request.ip || request.headers.get('x-forwarded-for') || 'unknown',
      user_agent: request.headers.get('user-agent') || 'unknown',
      referer: request.headers.get('referer') || 'unknown'
    }
    
    // Store the analytics event
    analyticsStore.push(enrichedData)
    
    // Keep only last 1000 events for demo
    if (analyticsStore.length > 1000) {
      analyticsStore.splice(0, analyticsStore.length - 1000)
    }
    
    console.log(`[Analytics API] Event received: ${enrichedData.event_type}`)
    
    // In production, you would:
    // 1. Validate the event data
    // 2. Store in database (PostgreSQL, MongoDB, etc.)
    // 3. Possibly send to external analytics service (Mixpanel, Amplitude, etc.)
    // 4. Process for real-time dashboards
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'Event tracked successfully',
        event_id: Date.now().toString(36) + Math.random().toString(36).substr(2)
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[Analytics API] Error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process analytics event',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  // For demo purposes, return analytics summary
  // In production, this would require authentication
  
  const searchParams = request.nextUrl.searchParams
  const eventType = searchParams.get('event_type')
  const limit = parseInt(searchParams.get('limit') || '50')
  
  let filteredEvents = analyticsStore
  
  if (eventType) {
    filteredEvents = analyticsStore.filter(event => event.event_type === eventType)
  }
  
  // Get summary statistics
  const eventCounts: Record<string, number> = {}
  const qrSources: Record<string, number> = {}
  const deviceTypes: Record<string, number> = {}
  
  analyticsStore.forEach(event => {
    // Count events by type
    eventCounts[event.event_type] = (eventCounts[event.event_type] || 0) + 1
    
    // Count QR code sources
    if (event.qr_params?.utm_source) {
      qrSources[event.qr_params.utm_source] = (qrSources[event.qr_params.utm_source] || 0) + 1
    }
    
    // Count device types
    if (event.device?.isMobile) {
      deviceTypes.mobile = (deviceTypes.mobile || 0) + 1
    } else if (event.device?.platform) {
      deviceTypes[event.device.platform] = (deviceTypes[event.device.platform] || 0) + 1
    }
  })
  
  const summary = {
    total_events: analyticsStore.length,
    event_types: eventCounts,
    qr_sources: qrSources,
    device_types: deviceTypes,
    recent_events: filteredEvents.slice(-limit).reverse(),
    timeframe: {
      first_event: analyticsStore[0]?.timestamp || null,
      last_event: analyticsStore[analyticsStore.length - 1]?.timestamp || null
    }
  }
  
  return NextResponse.json(summary, { status: 200 })
}