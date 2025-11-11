/**
 * Analytics API Endpoint
 *
 * Provides access to GA4 analytics data
 * GET /api/analytics?type=overview&startDate=30daysAgo&endDate=today
 */

import { NextRequest, NextResponse } from 'next/server'
import {
  getWebsiteMetrics,
  getTopPages,
  getTrafficSources,
  getDeviceBreakdown,
  getRealtimeUsers
} from '@/lib/ga4-client'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'overview'
    const startDate = searchParams.get('startDate') || '30daysAgo'
    const endDate = searchParams.get('endDate') || 'today'
    const limit = parseInt(searchParams.get('limit') || '10')

    // Basic authentication check (optional - add your own auth logic)
    // For now, we'll allow all requests, but you should add authentication
    // const authHeader = request.headers.get('authorization')
    // if (!authHeader || !isValidAuth(authHeader)) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    let data

    switch (type) {
      case 'overview':
      case 'metrics':
        data = await getWebsiteMetrics(startDate, endDate)
        break

      case 'pages':
        data = await getTopPages(startDate, endDate, limit)
        break

      case 'sources':
      case 'traffic':
        data = await getTrafficSources(startDate, endDate)
        break

      case 'devices':
        data = await getDeviceBreakdown(startDate, endDate)
        break

      case 'realtime':
        data = await getRealtimeUsers()
        break

      default:
        return NextResponse.json(
          { error: `Invalid analytics type: ${type}` },
          { status: 400 }
        )
    }

    // Format the response
    const formattedData = formatGA4Response(data, type)

    return NextResponse.json({
      success: true,
      type,
      dateRange: { startDate, endDate },
      data: formattedData,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Analytics API error:', error)

    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch analytics data',
        details: errorMessage
      },
      { status: 500 }
    )
  }
}

/**
 * Format GA4 API response into a more usable structure
 */
function formatGA4Response(response: any, type: string) {
  if (!response || !response.rows) {
    return []
  }

  return response.rows.map((row: any) => {
    const dimensions: Record<string, string> = {}
    const metrics: Record<string, number> = {}

    // Extract dimensions
    if (response.dimensionHeaders && row.dimensionValues) {
      response.dimensionHeaders.forEach((header: any, index: number) => {
        dimensions[header.name] = row.dimensionValues[index].value
      })
    }

    // Extract metrics
    if (response.metricHeaders && row.metricValues) {
      response.metricHeaders.forEach((header: any, index: number) => {
        const value = row.metricValues[index].value
        metrics[header.name] = parseFloat(value) || 0
      })
    }

    return {
      ...dimensions,
      ...metrics
    }
  })
}
