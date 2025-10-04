# Daily Content Intelligence Reports

## Overview

The daily report system automatically tracks query patterns and content performance, emailing insights to `spencer@point35.com` every morning at 9am GMT.

## How It Works

### 1. Query Tracking
Every query to the AI consultant is logged with:
- Query text
- Matched content (if any)
- Confidence score
- Visitor type (bot/chat/human)
- Timestamp

### 2. Daily Analysis
At 9am GMT daily, the system:
- Analyzes yesterday's query logs
- Identifies top-performing content
- Finds content gaps (unmatched queries)
- Generates actionable recommendations

### 3. Email Delivery
Report is automatically sent via Resend to your email.

## Sample Report

```
📊 DAILY CONTENT INTELLIGENCE REPORT
Date: 2025-01-27
Generated: 2025-01-28T09:00:00.000Z

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📈 OVERVIEW
• Total Queries: 15
• Matched: 12 (80%)
• Unmatched: 3 (20%)

🔥 TOP PERFORMING CONTENT
1. Insurance Case Study - 5 matches
2. LSA Education Case Study - 3 matches
3. Procurement Case Study - 2 matches
4. Methodology Overview - 2 matches

❌ UNMATCHED QUERIES (Content Gaps)
1. "healthcare AI implementation" - 2 requests
2. "small business automation" - 1 request

💡 Recommendation: Consider creating healthcare-focused case study (2 requests)

👥 VISITOR BREAKDOWN
• Chat: 12 (80%)
• Bot: 2 (13%)
• Human: 1 (7%)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 ACTIONABLE INSIGHTS

✅ Insurance Case Study is your top performer (33% of queries)
📊 Consider creating similar content to Insurance Case Study
⚠️  2 unique unmatched queries - opportunity for new content
🎯 Priority: Consider creating healthcare-focused case study (2 requests)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Configuration

### Environment Variables

Add to Vercel environment variables:

```bash
CRON_SECRET=your_random_secret_here  # Generate with: openssl rand -base64 32
RESEND_API_KEY=your_resend_api_key_here
```

### Changing Report Frequency

Edit `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/daily-report",
      "schedule": "0 9 * * *"  // Daily at 9am GMT
    }
  ]
}
```

**Schedule Options:**
- Daily: `"0 9 * * *"`
- Weekly (Mondays): `"0 9 * * 1"`
- Twice daily: `"0 9,17 * * *"` (9am and 5pm)

### Testing Manually

Trigger a report manually (requires CRON_SECRET):

```bash
curl -X GET \
  -H "Authorization: Bearer YOUR_CRON_SECRET" \
  https://your-domain.com/api/daily-report
```

## Log Format

The system tracks queries via console.log statements in this format:

```json
{
  "timestamp": "2025-01-27T14:30:00.000Z",
  "query": "insurance automation",
  "matchedContent": "insurance-brokerage-transformation",
  "confidence": 0.85,
  "visitorType": "chat",
  "source": "case_study"
}
```

Search Vercel logs for `CONTENT_MATCH:` to see tracked queries.

## Future Enhancements

### Phase 2 (Database Integration)
- Store logs in database for longer retention
- Track engagement metrics (time on content, follow-ups)
- Build trend analysis over time

### Phase 3 (Advanced Analytics)
- Conversion tracking
- A/B testing of content
- Visitor journey mapping
- Automated content recommendations

## Troubleshooting

### No Email Received

1. Check Vercel Cron logs: `vercel logs --follow`
2. Verify RESEND_API_KEY is set
3. Check email hasn't gone to spam
4. Verify Resend domain is verified

### Cron Not Running

1. Verify `vercel.json` is committed to git
2. Check Vercel dashboard → Settings → Cron Jobs
3. Ensure project is on Hobby plan or higher (free tier supports crons)

### Empty Reports

This is normal when:
- System just deployed (no data yet)
- Low traffic day (no queries)
- Queries matched existing content perfectly

---

**Created**: 2025-01-27
**Version**: 1.0
**Status**: ✅ Active (Daily at 9am GMT)
