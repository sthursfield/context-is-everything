#!/usr/bin/env python3
"""
GA4 Traffic Analysis Script

Analyzes GA4 data to distinguish real organic traffic from bot/owner visits.
Answers questions like:
- Is the site getting real organic traffic?
- Where are visitors coming from?
- What content is performing?
- What's the quality of traffic?

Usage:
    python scripts/analyze-ga4-traffic.py [--days 30] [--output report.txt]
"""

import json
import base64
import os
from datetime import datetime, timedelta
from collections import defaultdict
from google.analytics.data_v1beta import BetaAnalyticsDataClient
from google.analytics.data_v1beta.types import (
    DateRange,
    Dimension,
    Metric,
    RunReportRequest,
)

# GA4 Property ID
GA4_PROPERTY_ID = "506980538"


def get_ga4_client():
    """Initialize GA4 client with credentials from environment or file."""
    # Try environment variable first (production)
    credentials_b64 = os.getenv('GA4_SERVICE_ACCOUNT_KEY')

    if credentials_b64:
        credentials_json = json.loads(base64.b64decode(credentials_b64))
    else:
        # Fall back to file (development)
        with open('ga4-service-account.json', 'r') as f:
            credentials_json = json.load(f)

    return BetaAnalyticsDataClient.from_service_account_info(credentials_json)


def analyze_traffic_sources(client, days=30):
    """Analyze where traffic is coming from."""
    print(f"\n📊 TRAFFIC SOURCES ANALYSIS (Last {days} days)")
    print("=" * 60)

    request = RunReportRequest(
        property=f"properties/{GA4_PROPERTY_ID}",
        date_ranges=[DateRange(
            start_date=f"{days}daysAgo",
            end_date="today"
        )],
        dimensions=[
            Dimension(name="sessionSource"),
            Dimension(name="sessionMedium"),
            Dimension(name="sessionCampaignName"),
        ],
        metrics=[
            Metric(name="sessions"),
            Metric(name="activeUsers"),
            Metric(name="screenPageViews"),
            Metric(name="averageSessionDuration"),
            Metric(name="bounceRate"),
        ],
    )

    response = client.run_report(request)

    traffic_sources = []
    for row in response.rows:
        source = row.dimension_values[0].value
        medium = row.dimension_values[1].value
        campaign = row.dimension_values[2].value

        sessions = int(row.metric_values[0].value)
        users = int(row.metric_values[1].value)
        pageviews = int(row.metric_values[2].value)
        avg_duration = float(row.metric_values[3].value)
        bounce_rate = float(row.metric_values[4].value)

        traffic_sources.append({
            'source': source,
            'medium': medium,
            'campaign': campaign,
            'sessions': sessions,
            'users': users,
            'pageviews': pageviews,
            'avg_duration': avg_duration,
            'bounce_rate': bounce_rate
        })

    # Sort by sessions
    traffic_sources.sort(key=lambda x: x['sessions'], reverse=True)

    # Categorize traffic
    organic_traffic = []
    referral_traffic = []
    direct_traffic = []
    other_traffic = []

    for item in traffic_sources:
        if item['medium'] == 'organic':
            organic_traffic.append(item)
        elif item['medium'] == 'referral':
            referral_traffic.append(item)
        elif item['source'] == '(direct)':
            direct_traffic.append(item)
        else:
            other_traffic.append(item)

    # Print summary
    total_sessions = sum(item['sessions'] for item in traffic_sources)
    total_users = sum(item['users'] for item in traffic_sources)

    print(f"\n📈 OVERVIEW:")
    print(f"Total Sessions: {total_sessions}")
    print(f"Total Users: {total_users}")
    print(f"Unique Sources: {len(traffic_sources)}")

    # Organic Traffic
    if organic_traffic:
        organic_sessions = sum(item['sessions'] for item in organic_traffic)
        print(f"\n🌱 ORGANIC TRAFFIC: {organic_sessions} sessions ({organic_sessions/total_sessions*100:.1f}%)")
        for item in organic_traffic:
            print(f"  • {item['source']}: {item['sessions']} sessions, {item['users']} users")
            print(f"    Avg Duration: {item['avg_duration']:.1f}s, Bounce: {item['bounce_rate']*100:.1f}%")
    else:
        print("\n🌱 ORGANIC TRAFFIC: None detected")

    # Referral Traffic (LinkedIn, etc.)
    if referral_traffic:
        referral_sessions = sum(item['sessions'] for item in referral_traffic)
        print(f"\n🔗 REFERRAL TRAFFIC: {referral_sessions} sessions ({referral_sessions/total_sessions*100:.1f}%)")
        for item in referral_traffic:
            print(f"  • {item['source']}: {item['sessions']} sessions, {item['users']} users")
            print(f"    Avg Duration: {item['avg_duration']:.1f}s, Bounce: {item['bounce_rate']*100:.1f}%")
    else:
        print("\n🔗 REFERRAL TRAFFIC: None detected")

    # Direct Traffic (could be you, bookmarks, or typed URL)
    if direct_traffic:
        direct_sessions = sum(item['sessions'] for item in direct_traffic)
        print(f"\n📌 DIRECT TRAFFIC: {direct_sessions} sessions ({direct_sessions/total_sessions*100:.1f}%)")
        print(f"  ⚠️  Note: This could include:")
        print(f"      - Your own visits")
        print(f"      - Bookmarked users")
        print(f"      - Direct URL entry")
        for item in direct_traffic:
            print(f"  • Sessions: {item['sessions']}, Users: {item['users']}")
            print(f"    Avg Duration: {item['avg_duration']:.1f}s, Bounce: {item['bounce_rate']*100:.1f}%")

    return traffic_sources


def analyze_user_behavior(client, days=30):
    """Analyze user behavior patterns to identify real vs bot traffic."""
    print(f"\n👥 USER BEHAVIOR ANALYSIS")
    print("=" * 60)

    request = RunReportRequest(
        property=f"properties/{GA4_PROPERTY_ID}",
        date_ranges=[DateRange(
            start_date=f"{days}daysAgo",
            end_date="today"
        )],
        dimensions=[
            Dimension(name="newVsReturning"),
            Dimension(name="deviceCategory"),
        ],
        metrics=[
            Metric(name="activeUsers"),
            Metric(name="sessions"),
            Metric(name="screenPageViews"),
            Metric(name="averageSessionDuration"),
            Metric(name="engagementRate"),
        ],
    )

    response = client.run_report(request)

    print("\n🔄 NEW vs RETURNING VISITORS:")
    for row in response.rows:
        user_type = row.dimension_values[0].value
        device = row.dimension_values[1].value
        users = int(row.metric_values[0].value)
        sessions = int(row.metric_values[1].value)
        pageviews = int(row.metric_values[2].value)
        avg_duration = float(row.metric_values[3].value)
        engagement = float(row.metric_values[4].value)

        print(f"\n  {user_type} - {device}:")
        print(f"    Users: {users}, Sessions: {sessions}, Pages/Session: {pageviews/sessions:.1f}")
        print(f"    Avg Duration: {avg_duration:.1f}s, Engagement: {engagement*100:.1f}%")

        # Quality indicators
        if avg_duration > 60 and engagement > 0.5:
            print(f"    ✅ High quality traffic (engaged users)")
        elif avg_duration > 30:
            print(f"    ✓ Medium quality traffic")
        else:
            print(f"    ⚠️  Low engagement (possible bot or bounce)")


def analyze_top_pages(client, days=30):
    """Analyze which pages are getting traffic."""
    print(f"\n📄 TOP PAGES ANALYSIS")
    print("=" * 60)

    request = RunReportRequest(
        property=f"properties/{GA4_PROPERTY_ID}",
        date_ranges=[DateRange(
            start_date=f"{days}daysAgo",
            end_date="today"
        )],
        dimensions=[
            Dimension(name="pagePath"),
            Dimension(name="pageTitle"),
        ],
        metrics=[
            Metric(name="screenPageViews"),
            Metric(name="activeUsers"),
            Metric(name="averageSessionDuration"),
        ],
        order_bys=[{
            "metric": {"metric_name": "screenPageViews"},
            "desc": True
        }],
        limit=10,
    )

    response = client.run_report(request)

    print("\n🏆 TOP 10 PAGES:")
    for i, row in enumerate(response.rows, 1):
        path = row.dimension_values[0].value
        title = row.dimension_values[1].value
        views = int(row.metric_values[0].value)
        users = int(row.metric_values[1].value)
        duration = float(row.metric_values[2].value)

        print(f"\n  {i}. {title or path}")
        print(f"     Views: {views}, Unique Users: {users}, Avg Time: {duration:.1f}s")


def analyze_geographic_distribution(client, days=30):
    """Analyze where users are located."""
    print(f"\n🌍 GEOGRAPHIC DISTRIBUTION")
    print("=" * 60)

    request = RunReportRequest(
        property=f"properties/{GA4_PROPERTY_ID}",
        date_ranges=[DateRange(
            start_date=f"{days}daysAgo",
            end_date="today"
        )],
        dimensions=[
            Dimension(name="country"),
            Dimension(name="city"),
        ],
        metrics=[
            Metric(name="activeUsers"),
            Metric(name="sessions"),
        ],
        order_bys=[{
            "metric": {"metric_name": "sessions"},
            "desc": True
        }],
        limit=10,
    )

    response = client.run_report(request)

    print("\n🗺️  TOP LOCATIONS:")
    for row in response.rows:
        country = row.dimension_values[0].value
        city = row.dimension_values[1].value
        users = int(row.metric_values[0].value)
        sessions = int(row.metric_values[1].value)

        print(f"  • {city}, {country}: {users} users, {sessions} sessions")


def main():
    """Run complete traffic analysis."""
    print("\n" + "=" * 60)
    print("  GA4 TRAFFIC ANALYSIS - Context is Everything")
    print("  Property ID: 506980538")
    print("=" * 60)

    try:
        client = get_ga4_client()

        # Run analyses
        analyze_traffic_sources(client, days=30)
        analyze_user_behavior(client, days=30)
        analyze_top_pages(client, days=30)
        analyze_geographic_distribution(client, days=30)

        print("\n" + "=" * 60)
        print("  📊 ANALYSIS COMPLETE")
        print("=" * 60)

        print("\n💡 INSIGHTS:")
        print("  • Check 'ORGANIC TRAFFIC' for Google/Bing search visitors")
        print("  • Check 'REFERRAL TRAFFIC' for LinkedIn and other referrals")
        print("  • 'DIRECT TRAFFIC' may include your own visits")
        print("  • Look at 'Avg Duration' and 'Engagement' for quality signals")
        print("\n")

    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    main()
