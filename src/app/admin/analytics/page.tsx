import AnalyticsDashboard from '@/components/AnalyticsDashboard'

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Website Analytics</h1>
          <p className="text-gray-600 mt-2">GA4 Property ID: 506980538</p>
        </div>

        <AnalyticsDashboard />
      </div>
    </div>
  )
}
