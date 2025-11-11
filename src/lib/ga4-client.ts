/**
 * GA4 Analytics Client
 *
 * Provides utilities for fetching Google Analytics 4 data
 * Property ID: 506980538
 */

import { BetaAnalyticsDataClient } from '@google-analytics/data'

// GA4 Property ID
export const GA4_PROPERTY_ID = '506980538'

/**
 * Initialize GA4 client with service account credentials
 */
export function getGA4Client() {
  // Get credentials from environment
  const credentials = process.env.GA4_SERVICE_ACCOUNT_KEY

  if (!credentials) {
    throw new Error('GA4_SERVICE_ACCOUNT_KEY environment variable is not set')
  }

  // Parse base64-encoded JSON credentials
  let credentialsJson
  try {
    const decodedCredentials = Buffer.from(credentials, 'base64').toString('utf-8')
    credentialsJson = JSON.parse(decodedCredentials)
  } catch (error) {
    throw new Error('Failed to parse GA4 service account credentials')
  }

  // Initialize client with credentials
  const analyticsDataClient = new BetaAnalyticsDataClient({
    credentials: credentialsJson,
  })

  return analyticsDataClient
}

/**
 * Fetch basic website metrics for a date range
 */
export async function getWebsiteMetrics(startDate: string = '30daysAgo', endDate: string = 'today') {
  const client = getGA4Client()

  const [response] = await client.runReport({
    property: `properties/${GA4_PROPERTY_ID}`,
    dateRanges: [
      {
        startDate,
        endDate,
      },
    ],
    dimensions: [
      {
        name: 'date',
      },
    ],
    metrics: [
      {
        name: 'activeUsers',
      },
      {
        name: 'sessions',
      },
      {
        name: 'screenPageViews',
      },
      {
        name: 'averageSessionDuration',
      },
      {
        name: 'bounceRate',
      },
    ],
  })

  return response
}

/**
 * Fetch top pages by page views
 */
export async function getTopPages(startDate: string = '30daysAgo', endDate: string = 'today', limit: number = 10) {
  const client = getGA4Client()

  const [response] = await client.runReport({
    property: `properties/${GA4_PROPERTY_ID}`,
    dateRanges: [
      {
        startDate,
        endDate,
      },
    ],
    dimensions: [
      {
        name: 'pagePath',
      },
      {
        name: 'pageTitle',
      },
    ],
    metrics: [
      {
        name: 'screenPageViews',
      },
      {
        name: 'activeUsers',
      },
    ],
    orderBys: [
      {
        metric: {
          metricName: 'screenPageViews',
        },
        desc: true,
      },
    ],
    limit,
  })

  return response
}

/**
 * Fetch traffic sources
 */
export async function getTrafficSources(startDate: string = '30daysAgo', endDate: string = 'today') {
  const client = getGA4Client()

  const [response] = await client.runReport({
    property: `properties/${GA4_PROPERTY_ID}`,
    dateRanges: [
      {
        startDate,
        endDate,
      },
    ],
    dimensions: [
      {
        name: 'sessionSource',
      },
      {
        name: 'sessionMedium',
      },
    ],
    metrics: [
      {
        name: 'sessions',
      },
      {
        name: 'activeUsers',
      },
    ],
    orderBys: [
      {
        metric: {
          metricName: 'sessions',
        },
        desc: true,
      },
    ],
  })

  return response
}

/**
 * Fetch device category breakdown
 */
export async function getDeviceBreakdown(startDate: string = '30daysAgo', endDate: string = 'today') {
  const client = getGA4Client()

  const [response] = await client.runReport({
    property: `properties/${GA4_PROPERTY_ID}`,
    dateRanges: [
      {
        startDate,
        endDate,
      },
    ],
    dimensions: [
      {
        name: 'deviceCategory',
      },
    ],
    metrics: [
      {
        name: 'activeUsers',
      },
      {
        name: 'sessions',
      },
    ],
  })

  return response
}

/**
 * Fetch real-time active users (last 30 minutes)
 */
export async function getRealtimeUsers() {
  const client = getGA4Client()

  const [response] = await client.runRealtimeReport({
    property: `properties/${GA4_PROPERTY_ID}`,
    dimensions: [
      {
        name: 'unifiedScreenName',
      },
    ],
    metrics: [
      {
        name: 'activeUsers',
      },
    ],
  })

  return response
}
