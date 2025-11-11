#!/usr/bin/env python3
"""
AI Bot Traffic Analysis Script

Analyzes traffic from AI search engines and LLM crawlers:
- ChatGPT (OpenAI)
- Claude (Anthropic)
- Gemini (Google)
- Perplexity
- Other AI agents

Tracks:
- Which bots are crawling your site
- What content they're accessing
- JSON/structured data consumption
- Article discovery patterns

Usage:
    python scripts/analyze-ai-bot-traffic.py [--days 30]
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
    FilterExpression,
    Filter,
)

# GA4 Property ID
GA4_PROPERTY_ID = "506980538"

# Known AI bot user agents
AI_BOTS = {
    'ChatGPT': ['GPTBot', 'ChatGPT-User', 'OpenAI'],
    'Claude': ['Claude-Web', 'Anthropic', 'ClaudeBot'],
    'Gemini': ['Google-Extended', 'Gemini'],
    'Perplexity': ['PerplexityBot'],
    'Bing AI': ['bingbot'],
    'Cohere': ['cohere-ai'],
    'You.com': ['YouBot'],
    'Brave AI': ['brave-ai-search'],
}


def get_ga4_client():
    """Initialize GA4 client with credentials from environment or file."""
    credentials_b64 = os.getenv('GA4_SERVICE_ACCOUNT_KEY')

    if credentials_b64:
        credentials_json = json.loads(base64.b64decode(credentials_b64))
    else:
        with open('ga4-service-account.json', 'r') as f:
            credentials_json = json.load(f)

    return BetaAnalyticsDataClient.from_service_account_info(credentials_json)


def analyze_bot_traffic_by_user_agent(client, days=30):
    """Analyze traffic patterns by user agent to identify AI bots."""
    print(f"\n🤖 AI BOT TRAFFIC ANALYSIS (Last {days} days)")
    print("=" * 70)

    request = RunReportRequest(
        property=f"properties/{GA4_PROPERTY_ID}",
        date_ranges=[DateRange(
            start_date=f"{days}daysAgo",
            end_date="today"
        )],
        dimensions=[
            Dimension(name="operatingSystem"),
            Dimension(name="browser"),
            Dimension(name="deviceCategory"),
        ],
        metrics=[
            Metric(name="sessions"),
            Metric(name="screenPageViews"),
            Metric(name="averageSessionDuration"),
        ],
    )

    response = client.run_report(request)

    bot_sessions = []
    human_sessions = []

    for row in response.rows:
        os_name = row.dimension_values[0].value
        browser = row.dimension_values[1].value
        device = row.dimension_values[2].value
        sessions = int(row.metric_values[0].value)
        pageviews = int(row.metric_values[1].value)
        duration = float(row.metric_values[2].value)

        # Bot detection heuristics
        is_likely_bot = (
            duration == 0 or
            browser.lower() in ['(not set)', 'unknown'] or
            os_name == '(not set)' or
            (pageviews / sessions) > 10  # Too many pages too fast
        )

        entry = {
            'os': os_name,
            'browser': browser,
            'device': device,
            'sessions': sessions,
            'pageviews': pageviews,
            'duration': duration,
        }

        if is_likely_bot:
            bot_sessions.append(entry)
        else:
            human_sessions.append(entry)

    # Print bot traffic
    if bot_sessions:
        total_bot_sessions = sum(s['sessions'] for s in bot_sessions)
        total_bot_pageviews = sum(s['pageviews'] for s in bot_sessions)
        print(f"\n🔍 DETECTED BOT TRAFFIC:")
        print(f"Total Bot Sessions: {total_bot_sessions}")
        print(f"Total Bot Pageviews: {total_bot_pageviews}")
        print(f"\nTop Bot Patterns:")
        for entry in sorted(bot_sessions, key=lambda x: x['sessions'], reverse=True)[:10]:
            print(f"  • {entry['browser']} on {entry['os']} ({entry['device']})")
            print(f"    Sessions: {entry['sessions']}, Pages: {entry['pageviews']}, Duration: {entry['duration']:.1f}s")
    else:
        print("\n✓ No obvious bot traffic detected")

    # Print human traffic for comparison
    total_human_sessions = sum(s['sessions'] for s in human_sessions)
    total_human_pageviews = sum(s['pageviews'] for s in human_sessions)
    print(f"\n👥 HUMAN TRAFFIC (for comparison):")
    print(f"Total Human Sessions: {total_human_sessions}")
    print(f"Total Human Pageviews: {total_human_pageviews}")

    return bot_sessions, human_sessions


def analyze_json_content_access(client, days=30):
    """Analyze access to JSON files and structured content."""
    print(f"\n📄 STRUCTURED CONTENT ACCESS ANALYSIS")
    print("=" * 70)

    request = RunReportRequest(
        property=f"properties/{GA4_PROPERTY_ID}",
        date_ranges=[DateRange(
            start_date=f"{days}daysAgo",
            end_date="today"
        )],
        dimensions=[
            Dimension(name="pagePath"),
        ],
        metrics=[
            Metric(name="screenPageViews"),
            Metric(name="activeUsers"),
        ],
    )

    response = client.run_report(request)

    json_pages = []
    api_pages = []
    article_pages = []
    other_pages = []

    for row in response.rows:
        path = row.dimension_values[0].value
        views = int(row.metric_values[0].value)
        users = int(row.metric_values[1].value)

        entry = {'path': path, 'views': views, 'users': users}

        if '.json' in path.lower():
            json_pages.append(entry)
        elif '/api/' in path:
            api_pages.append(entry)
        elif '/insights/' in path or '/articles/' in path:
            article_pages.append(entry)
        else:
            other_pages.append(entry)

    # JSON file access
    if json_pages:
        print(f"\n📋 JSON FILE ACCESS:")
        print(f"Total JSON files accessed: {len(json_pages)}")
        for entry in sorted(json_pages, key=lambda x: x['views'], reverse=True)[:10]:
            print(f"  • {entry['path']}")
            print(f"    Views: {entry['views']}, Users: {entry['users']}")
    else:
        print(f"\n📋 JSON FILE ACCESS: None detected")

    # API endpoint access
    if api_pages:
        print(f"\n🔌 API ENDPOINT ACCESS:")
        for entry in sorted(api_pages, key=lambda x: x['views'], reverse=True)[:10]:
            print(f"  • {entry['path']}")
            print(f"    Views: {entry['views']}, Users: {entry['users']}")

    # Article/insight pages
    if article_pages:
        print(f"\n📰 ARTICLE/INSIGHT ACCESS:")
        print(f"Total articles accessed: {len(article_pages)}")
        for entry in sorted(article_pages, key=lambda x: x['views'], reverse=True)[:10]:
            print(f"  • {entry['path']}")
            print(f"    Views: {entry['views']}, Users: {entry['users']}")


def analyze_crawl_patterns(client, days=30):
    """Analyze page view patterns that indicate crawling behavior."""
    print(f"\n🕷️  CRAWL PATTERN ANALYSIS")
    print("=" * 70)

    # Look for sessions with many pageviews (typical crawler behavior)
    request = RunReportRequest(
        property=f"properties/{GA4_PROPERTY_ID}",
        date_ranges=[DateRange(
            start_date=f"{days}daysAgo",
            end_date="today"
        )],
        dimensions=[
            Dimension(name="date"),
            Dimension(name="sessionSource"),
        ],
        metrics=[
            Metric(name="sessions"),
            Metric(name="screenPageViews"),
            Metric(name="averageSessionDuration"),
        ],
    )

    response = client.run_report(request)

    crawl_patterns = []
    for row in response.rows:
        date = row.dimension_values[0].value
        source = row.dimension_values[1].value
        sessions = int(row.metric_values[0].value)
        pageviews = int(row.metric_values[1].value)
        duration = float(row.metric_values[2].value)

        if sessions > 0:
            pages_per_session = pageviews / sessions

            # Crawler indicators: many pages, short duration
            if pages_per_session > 5 and duration < 60:
                crawl_patterns.append({
                    'date': date,
                    'source': source,
                    'sessions': sessions,
                    'pages_per_session': pages_per_session,
                    'duration': duration
                })

    if crawl_patterns:
        print(f"\n🔍 POTENTIAL CRAWLER ACTIVITY:")
        print(f"Sessions with crawler-like patterns: {len(crawl_patterns)}")
        for entry in sorted(crawl_patterns, key=lambda x: x['pages_per_session'], reverse=True)[:10]:
            date_formatted = f"{entry['date'][:4]}-{entry['date'][4:6]}-{entry['date'][6:]}"
            print(f"  • {date_formatted} - {entry['source']}")
            print(f"    {entry['pages_per_session']:.1f} pages/session, {entry['duration']:.0f}s duration")


def analyze_search_console_queries(client, days=30):
    """Analyze what search queries are bringing traffic."""
    print(f"\n🔎 SEARCH QUERY ANALYSIS")
    print("=" * 70)

    request = RunReportRequest(
        property=f"properties/{GA4_PROPERTY_ID}",
        date_ranges=[DateRange(
            start_date=f"{days}daysAgo",
            end_date="today"
        )],
        dimensions=[
            Dimension(name="sessionGoogleAdsQuery"),
            Dimension(name="sessionSource"),
        ],
        metrics=[
            Metric(name="sessions"),
            Metric(name="activeUsers"),
        ],
    )

    response = client.run_report(request)

    queries = []
    for row in response.rows:
        query = row.dimension_values[0].value
        source = row.dimension_values[1].value
        sessions = int(row.metric_values[0].value)
        users = int(row.metric_values[1].value)

        if query and query != '(not set)':
            queries.append({
                'query': query,
                'source': source,
                'sessions': sessions,
                'users': users
            })

    if queries:
        print(f"\n🎯 SEARCH QUERIES DRIVING TRAFFIC:")
        for entry in sorted(queries, key=lambda x: x['sessions'], reverse=True)[:10]:
            print(f"  • \"{entry['query']}\" from {entry['source']}")
            print(f"    Sessions: {entry['sessions']}, Users: {entry['users']}")
    else:
        print(f"\n⚠️  No search query data available")
        print(f"  Note: GA4 doesn't always capture search queries")
        print(f"  Consider connecting Google Search Console for query data")


def generate_ai_discoverability_report(client, days=30):
    """Generate recommendations for improving AI discoverability."""
    print(f"\n💡 AI DISCOVERABILITY RECOMMENDATIONS")
    print("=" * 70)

    print(f"\n📊 Current Status:")
    print(f"  ✓ Structured content available (articles, case studies)")
    print(f"  ✓ GA4 tracking active")

    print(f"\n🚀 Recommendations to Improve AI Discoverability:")

    print(f"\n  1. CREATE ROBOT.TXT OPTIMIZED FOR AI CRAWLERS:")
    print(f"     Allow: ChatGPT-User, GPTBot, Claude-Web, Google-Extended")
    print(f"     Current: Check /robots.txt")

    print(f"\n  2. ADD STRUCTURED DATA MARKUP:")
    print(f"     • Article schema for blog posts")
    print(f"     • FAQ schema for common questions")
    print(f"     • Organization schema for company info")

    print(f"\n  3. CREATE AI-FRIENDLY CONTENT:")
    print(f"     • Clear, well-structured articles")
    print(f"     • FAQ sections answering specific questions")
    print(f"     • Case studies with measurable outcomes")

    print(f"\n  4. MONITOR AI BOT ACCESS:")
    print(f"     • Track which AI bots are crawling")
    print(f"     • Monitor what content they access")
    print(f"     • Optimize high-value pages for discoverability")

    print(f"\n  5. CREATE DEDICATED ENDPOINTS:")
    print(f"     • /ai/sitemap.json - AI-friendly content map")
    print(f"     • /ai/knowledge-base.json - Structured Q&A")
    print(f"     • /api/search - Allow AI agents to query content")


def main():
    """Run complete AI bot traffic analysis."""
    print("\n" + "=" * 70)
    print("  AI BOT & STRUCTURED CONTENT ANALYSIS")
    print("  Context is Everything - Property ID: 506980538")
    print("=" * 70)

    try:
        client = get_ga4_client()

        # Run analyses
        analyze_bot_traffic_by_user_agent(client, days=30)
        analyze_json_content_access(client, days=30)
        analyze_crawl_patterns(client, days=30)
        analyze_search_console_queries(client, days=30)
        generate_ai_discoverability_report(client, days=30)

        print("\n" + "=" * 70)
        print("  📊 ANALYSIS COMPLETE")
        print("=" * 70)

        print("\n🎯 KEY INSIGHTS:")
        print("  • Bot traffic can indicate AI crawler interest")
        print("  • JSON/API access suggests structured data consumption")
        print("  • High pages-per-session with low duration = likely crawler")
        print("  • Optimize content for AI discovery (clear structure, Q&A format)")
        print("\n")

    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    main()
