#!/usr/bin/env python3
"""
AI Concierge Usage Analysis Script

Analyzes how visitors interact with the AI concierge:
- How often the concierge is used
- What questions visitors ask (from event tracking)
- Which articles the concierge might be recommending
- Conversion patterns from concierge to contact forms

Usage:
    python scripts/analyze-concierge-usage.py [--days 30]
"""

import json
import base64
import os
import sys
from datetime import datetime, timedelta
from collections import defaultdict, Counter
from google.analytics.data_v1beta import BetaAnalyticsDataClient
from google.analytics.data_v1beta.types import (
    DateRange,
    Dimension,
    Metric,
    RunReportRequest,
    FilterExpression,
    Filter,
)

# GA4 Property ID
GA4_PROPERTY_ID = "506980538"

# Articles mentioned in AI system prompt
SYSTEM_PROMPT_ARTICLES = [
    "Why AI Projects Fail",
    "Worthless Technology Stack",
    "Hidden Vendor Costs",
    "Complete Cost of AI",
    "Signs You Need AI",
    "Faster, Cheaper, Better AI",
    "Where to Start with AI"
]

# All articles from sitemap (search-only visibility)
ALL_ARTICLES = [
    "why-ai-projects-fail",
    "worthless-technology-stack",
    "hidden-vendor-costs",
    "complete-cost-of-ai",
    "signs-you-need-ai",
    "faster-cheaper-better-ai",
    "where-to-start-with-ai",
    "8-ai-mistakes-costing-uk-businesses",
    "information-asymmetry-buying-ia-vs-ai",
    "ai-native-buyers-marketing-gap"
]


def get_ga4_client():
    """Initialize GA4 client with credentials from environment or file."""
    credentials_b64 = os.getenv('GA4_SERVICE_ACCOUNT_KEY')

    if credentials_b64:
        credentials_json = json.loads(base64.b64decode(credentials_b64))
    else:
        with open('ga4-service-account.json', 'r') as f:
            credentials_json = json.load(f)

    return BetaAnalyticsDataClient.from_service_account_info(credentials_json)


def analyze_page_engagement(client, days=30):
    """Analyze which pages visitors engage with."""
    print(f"\n📄 PAGE ENGAGEMENT ANALYSIS (Last {days} days)")
    print("=" * 70)

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
            Metric(name="engagementRate"),
        ],
    )

    response = client.run_report(request)

    # Categorize pages
    homepage_visits = []
    article_visits = []
    chat_interactions = []

    for row in response.rows:
        path = row.dimension_values[0].value
        title = row.dimension_values[1].value
        views = int(row.metric_values[0].value)
        users = int(row.metric_values[1].value)
        duration = float(row.metric_values[2].value)
        engagement = float(row.metric_values[3].value)

        entry = {
            'path': path,
            'title': title,
            'views': views,
            'users': users,
            'duration': duration,
            'engagement': engagement
        }

        # Categorize
        if path == '/' or path == '':
            homepage_visits.append(entry)
        elif '/insights/' in path:
            article_visits.append(entry)

    # Report homepage engagement (where chat is)
    if homepage_visits:
        print(f"\n🏠 HOMEPAGE ENGAGEMENT (Chat Interface Location):")
        for entry in homepage_visits:
            print(f"  Views: {entry['views']}, Users: {entry['users']}")
            print(f"  Avg Duration: {entry['duration']:.1f}s, Engagement: {entry['engagement']*100:.1f}%")
    else:
        print(f"\n🏠 HOMEPAGE ENGAGEMENT: No data")

    # Report article access
    if article_visits:
        print(f"\n📰 ARTICLE ACCESS (Search-Only Content):")
        print(f"Total articles accessed: {len(article_visits)}")
        for entry in sorted(article_visits, key=lambda x: x['views'], reverse=True):
            article_slug = entry['path'].replace('/insights/', '').strip('/')
            is_in_prompt = any(slug for slug in ALL_ARTICLES if slug in entry['path'])
            marker = "✓ In AI Prompt" if is_in_prompt else ""

            print(f"\n  • {entry['title'] or entry['path']} {marker}")
            print(f"    Views: {entry['views']}, Users: {entry['users']}")
            print(f"    Duration: {entry['duration']:.1f}s, Engagement: {entry['engagement']*100:.1f}%")
    else:
        print(f"\n📰 ARTICLE ACCESS: No article views detected")

    return homepage_visits, article_visits


def analyze_traffic_sources_to_articles(client, days=30):
    """Analyze how visitors are finding the hidden articles."""
    print(f"\n🔍 ARTICLE DISCOVERY ANALYSIS")
    print("=" * 70)

    # Get article pages with source information
    request = RunReportRequest(
        property=f"properties/{GA4_PROPERTY_ID}",
        date_ranges=[DateRange(
            start_date=f"{days}daysAgo",
            end_date="today"
        )],
        dimensions=[
            Dimension(name="pagePath"),
            Dimension(name="sessionSource"),
            Dimension(name="sessionMedium"),
        ],
        metrics=[
            Metric(name="screenPageViews"),
            Metric(name="activeUsers"),
        ],
    )

    response = client.run_report(request)

    article_sources = defaultdict(list)

    for row in response.rows:
        path = row.dimension_values[0].value
        source = row.dimension_values[1].value
        medium = row.dimension_values[2].value
        views = int(row.metric_values[0].value)
        users = int(row.metric_values[1].value)

        if '/insights/' in path:
            article_sources[path].append({
                'source': source,
                'medium': medium,
                'views': views,
                'users': users
            })

    if article_sources:
        print(f"\n📊 HOW VISITORS FIND ARTICLES:")
        for path, sources in article_sources.items():
            print(f"\n  Article: {path}")
            for source_data in sources:
                print(f"    {source_data['source']} / {source_data['medium']}: {source_data['views']} views, {source_data['users']} users")
    else:
        print(f"\n⚠️  No article discovery data available")
        print(f"  This suggests articles aren't being accessed yet via search engines or AI")


def analyze_event_tracking(client, days=30):
    """Analyze custom events that might track concierge interactions."""
    print(f"\n📊 EVENT TRACKING ANALYSIS")
    print("=" * 70)

    request = RunReportRequest(
        property=f"properties/{GA4_PROPERTY_ID}",
        date_ranges=[DateRange(
            start_date=f"{days}daysAgo",
            end_date="today"
        )],
        dimensions=[
            Dimension(name="eventName"),
        ],
        metrics=[
            Metric(name="eventCount"),
            Metric(name="totalUsers"),
        ],
    )

    response = client.run_report(request)

    events = []
    for row in response.rows:
        event_name = row.dimension_values[0].value
        count = int(row.metric_values[0].value)
        users = int(row.metric_values[1].value)

        events.append({
            'name': event_name,
            'count': count,
            'users': users
        })

    if events:
        print(f"\n🎯 TRACKED EVENTS:")
        for event in sorted(events, key=lambda x: x['count'], reverse=True):
            print(f"  • {event['name']}: {event['count']} events, {event['users']} users")
    else:
        print(f"\n⚠️  No custom events detected")

    # Check for chat/concierge related events
    chat_events = [e for e in events if 'chat' in e['name'].lower() or 'concierge' in e['name'].lower() or 'ai' in e['name'].lower()]
    if chat_events:
        print(f"\n💬 CHAT/CONCIERGE EVENTS:")
        for event in chat_events:
            print(f"  • {event['name']}: {event['count']} events, {event['users']} users")
    else:
        print(f"\n💬 CHAT/CONCIERGE EVENTS: None detected")
        print(f"  Recommendation: Add custom event tracking for chat interactions")


def analyze_user_journeys(client, days=30):
    """Analyze user flow from homepage (chat) to articles."""
    print(f"\n🛤️  USER JOURNEY ANALYSIS")
    print("=" * 70)

    # This would require more advanced GA4 exploration reports
    # For now, we can infer patterns from engagement metrics

    print(f"\n💡 ANALYSIS INSIGHTS:")
    print(f"  • Articles are 'search-only' - hidden from navigation")
    print(f"  • AI concierge can reference them conversationally")
    print(f"  • Need to track: Does concierge mention articles? Do visitors click through?")
    print(f"\n  📝 RECOMMENDATION: Add event tracking for:")
    print(f"     1. When concierge mentions an article in response")
    print(f"     2. When visitor clicks article link from chat")
    print(f"     3. When visitor reaches article via organic search")


def generate_concierge_content_recommendations(client, days=30):
    """Generate recommendations for improving concierge content serving."""
    print(f"\n💡 CONCIERGE CONTENT RECOMMENDATIONS")
    print("=" * 70)

    print(f"\n📋 CURRENT STATE:")
    print(f"  • System prompt includes 7 articles (out of 10 total)")
    print(f"  • Missing from prompt: 8 AI Mistakes, Information Asymmetry, AI-Native Buyers")
    print(f"  • Content matching system: DISABLED (too aggressive)")
    print(f"  • AI handles all responses naturally")

    print(f"\n✅ WHAT'S WORKING:")
    print(f"  • Sophisticated AI system prompt with conversation patterns")
    print(f"  • Natural article references (not forced dumps)")
    print(f"  • Visitor pattern recognition (Senior Decision Maker, etc.)")
    print(f"  • Value escalation framework")

    print(f"\n🎯 RECOMMENDATIONS:")
    print(f"\n  1. UPDATE SYSTEM PROMPT:")
    print(f"     Add missing articles:")
    print(f"     - 8 AI Mistakes Costing UK Small Businesses £50K+")
    print(f"     - Information Asymmetry: Buying IA vs AI")
    print(f"     - The AI-Native Buyers Marketing Gap")

    print(f"\n  2. ADD EVENT TRACKING:")
    print(f"     Track when concierge:")
    print(f"     - Mentions article in response (article_mentioned)")
    print(f"     - Provides article link (article_linked)")
    print(f"     - Visitor clicks article link (article_clicked)")

    print(f"\n  3. MONITOR AI DISCOVERY:")
    print(f"     - Track organic search traffic to articles")
    print(f"     - Monitor AI bot crawling patterns")
    print(f"     - Analyze which articles AI search engines surface")

    print(f"\n  4. A/B TEST ARTICLE PRESENTATION:")
    print(f"     - Test inline article excerpts vs simple mentions")
    print(f"     - Test article recommendations timing (immediate vs after value demonstrated)")
    print(f"     - Measure click-through rates")


def main():
    """Run complete concierge usage analysis."""
    print("\n" + "=" * 70)
    print("  AI CONCIERGE USAGE ANALYSIS")
    print("  Context is Everything - Property ID: 506980538")
    print("=" * 70)

    try:
        client = get_ga4_client()

        # Run analyses
        analyze_page_engagement(client, days=30)
        analyze_traffic_sources_to_articles(client, days=30)
        analyze_event_tracking(client, days=30)
        analyze_user_journeys(client, days=30)
        generate_concierge_content_recommendations(client, days=30)

        print("\n" + "=" * 70)
        print("  📊 ANALYSIS COMPLETE")
        print("=" * 70)

        print("\n🎯 EXECUTIVE SUMMARY:")
        print("  • Concierge system prompt includes 7/10 articles")
        print("  • Content matching disabled - AI handles naturally")
        print("  • Need event tracking to measure article recommendations")
        print("  • Monitor AI bot traffic to measure discoverability")
        print("\n")

    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    main()
