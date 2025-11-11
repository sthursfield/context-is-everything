'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'

interface MetricData {
  date?: string
  activeUsers: number
  sessions: number
  screenPageViews: number
  averageSessionDuration?: number
  bounceRate?: number
}

interface PageData {
  pagePath: string
  pageTitle: string
  screenPageViews: number
  activeUsers: number
}

interface SourceData {
  sessionSource: string
  sessionMedium: string
  sessions: number
  activeUsers: number
}

export default function AnalyticsDashboard() {
  const [metrics, setMetrics] = useState<MetricData[]>([])
  const [topPages, setTopPages] = useState<PageData[]>([])
  const [sources, setSources] = useState<SourceData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState('30daysAgo')

  useEffect(() => {
    fetchAnalytics()
  }, [dateRange])

  const fetchAnalytics = async () => {
    setLoading(true)
    setError(null)

    try {
      // Fetch overview metrics
      const metricsRes = await fetch(`/api/analytics?type=metrics&startDate=${dateRange}&endDate=today`)
      const metricsData = await metricsRes.json()

      if (!metricsData.success) {
        throw new Error(metricsData.error || 'Failed to fetch metrics')
      }

      setMetrics(metricsData.data)

      // Fetch top pages
      const pagesRes = await fetch(`/api/analytics?type=pages&startDate=${dateRange}&endDate=today&limit=10`)
      const pagesData = await pagesRes.json()

      if (pagesData.success) {
        setTopPages(pagesData.data)
      }

      // Fetch traffic sources
      const sourcesRes = await fetch(`/api/analytics?type=sources&startDate=${dateRange}&endDate=today`)
      const sourcesData = await sourcesRes.json()

      if (sourcesData.success) {
        setSources(sourcesData.data)
      }

    } catch (err) {
      console.error('Analytics fetch error:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics')
    } finally {
      setLoading(false)
    }
  }

  // Calculate totals
  const totals = metrics.reduce(
    (acc, metric) => ({
      activeUsers: acc.activeUsers + metric.activeUsers,
      sessions: acc.sessions + metric.sessions,
      screenPageViews: acc.screenPageViews + metric.screenPageViews,
    }),
    { activeUsers: 0, sessions: 0, screenPageViews: 0 }
  )

  const avgSessionDuration = metrics.length > 0
    ? metrics.reduce((sum, m) => sum + (m.averageSessionDuration || 0), 0) / metrics.length
    : 0

  const avgBounceRate = metrics.length > 0
    ? metrics.reduce((sum, m) => sum + (m.bounceRate || 0), 0) / metrics.length
    : 0

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-pulse">Loading analytics...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-red-800 font-semibold mb-2">Error Loading Analytics</h3>
        <p className="text-red-600 text-sm">{error}</p>
        <Button onClick={fetchAnalytics} className="mt-4">
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="7daysAgo">Last 7 days</option>
          <option value="30daysAgo">Last 30 days</option>
          <option value="90daysAgo">Last 90 days</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Users"
          value={totals.activeUsers.toLocaleString()}
          icon="👥"
        />
        <MetricCard
          title="Sessions"
          value={totals.sessions.toLocaleString()}
          icon="🔄"
        />
        <MetricCard
          title="Page Views"
          value={totals.screenPageViews.toLocaleString()}
          icon="📄"
        />
        <MetricCard
          title="Avg. Session Duration"
          value={`${Math.round(avgSessionDuration)}s`}
          icon="⏱️"
        />
      </div>

      {/* Bounce Rate */}
      {avgBounceRate > 0 && (
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-600">Average Bounce Rate</div>
          <div className="text-2xl font-bold">{(avgBounceRate * 100).toFixed(1)}%</div>
        </div>
      )}

      {/* Top Pages */}
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">Top Pages</h3>
        <div className="space-y-2">
          {topPages.slice(0, 10).map((page, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{page.pageTitle || page.pagePath}</div>
                <div className="text-sm text-gray-500 truncate">{page.pagePath}</div>
              </div>
              <div className="text-right ml-4">
                <div className="font-semibold">{page.screenPageViews.toLocaleString()}</div>
                <div className="text-sm text-gray-500">{page.activeUsers.toLocaleString()} users</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Traffic Sources */}
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">Traffic Sources</h3>
        <div className="space-y-2">
          {sources.slice(0, 10).map((source, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
              <div>
                <div className="font-medium">{source.sessionSource}</div>
                <div className="text-sm text-gray-500">{source.sessionMedium}</div>
              </div>
              <div className="text-right">
                <div className="font-semibold">{source.sessions.toLocaleString()}</div>
                <div className="text-sm text-gray-500">{source.activeUsers.toLocaleString()} users</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function MetricCard({ title, value, icon }: { title: string; value: string; icon: string }) {
  return (
    <div className="bg-white p-6 rounded-lg border">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm text-gray-600">{title}</div>
        <div className="text-2xl">{icon}</div>
      </div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  )
}
