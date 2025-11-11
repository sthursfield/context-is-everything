# GA4 Quick Start Guide

## ✅ What's Already Done

I've set up the complete GA4 integration infrastructure for you:

### 1. **Installed Dependencies**
- ✅ `googleapis` package installed

### 2. **Created GA4 Client** ([src/lib/ga4-client.ts](../src/lib/ga4-client.ts))
Functions available:
- `getWebsiteMetrics()` - Daily metrics (users, sessions, page views, bounce rate)
- `getTopPages()` - Most viewed pages
- `getTrafficSources()` - Where traffic comes from
- `getDeviceBreakdown()` - Desktop/mobile/tablet breakdown
- `getRealtimeUsers()` - Live users on the site right now

### 3. **Created API Endpoint** ([src/app/api/analytics/route.ts](../src/app/api/analytics/route.ts))
Available endpoints:
- `GET /api/analytics?type=metrics` - Overview metrics
- `GET /api/analytics?type=pages` - Top pages
- `GET /api/analytics?type=sources` - Traffic sources
- `GET /api/analytics?type=devices` - Device breakdown
- `GET /api/analytics?type=realtime` - Live users

Optional parameters:
- `startDate` - e.g., `7daysAgo`, `30daysAgo`, `2024-01-01`
- `endDate` - e.g., `today`, `yesterday`, `2024-12-31`
- `limit` - Number of results (for pages/sources)

### 4. **Created Dashboard Component** ([src/components/AnalyticsDashboard.tsx](../src/components/AnalyticsDashboard.tsx))
- Displays key metrics
- Shows top pages
- Lists traffic sources
- Date range selector (7/30/90 days)

---

## 🔑 What You Need to Do

### Step 1: Get Service Account Credentials

Follow the detailed guide in [GA4_API_SETUP.md](./GA4_API_SETUP.md)

**Quick summary:**
1. Go to Google Cloud Console
2. Create a new project
3. Enable Google Analytics Data API
4. Create a service account
5. Download JSON key
6. Add service account email to GA4 property (Viewer access)

### Step 2: Add Credentials to Project

Once you have the JSON file downloaded:

**Option A - Base64 Encode (Recommended for Production)**
```bash
# From project root
cat path/to/your-service-account-key.json | base64
```

Copy the output and add to `.env.local`:
```bash
GA4_SERVICE_ACCOUNT_KEY=paste_base64_string_here
```

**Option B - Direct JSON File (Development Only)**
```bash
# Copy JSON file to project root
cp path/to/your-service-account-key.json ./ga4-service-account.json
```

Then modify `src/lib/ga4-client.ts` to read from file instead of env var.

### Step 3: Test the Integration

Start the dev server:
```bash
npm run dev
```

Test the API:
```bash
curl http://localhost:3000/api/analytics?type=metrics&startDate=7daysAgo&endDate=today
```

You should see JSON data with your analytics.

### Step 4: Add Dashboard to a Page

Create a new page or add to existing one:

```tsx
import AnalyticsDashboard from '@/components/AnalyticsDashboard'

export default function AnalyticsPage() {
  return (
    <div>
      <h1>Website Analytics</h1>
      <AnalyticsDashboard />
    </div>
  )
}
```

---

## 🚀 Deploy to Production (Vercel)

Once everything works locally:

### 1. Add Environment Variable to Vercel
```bash
# Base64 encode your service account JSON
cat ga4-service-account.json | base64 | pbcopy  # Copies to clipboard (macOS)
```

Then go to:
- Vercel Dashboard → Your Project → Settings → Environment Variables
- Add new variable:
  - **Name**: `GA4_SERVICE_ACCOUNT_KEY`
  - **Value**: Paste the base64 string
  - **Environments**: Production, Preview, Development
- Click "Save"

### 2. Redeploy
```bash
git add -A
git commit -m "Add GA4 analytics integration"
git push origin main
vercel --prod
```

---

## 📊 Example API Calls

### Get last 30 days overview
```bash
curl http://localhost:3000/api/analytics?type=metrics&startDate=30daysAgo&endDate=today
```

### Get top 10 pages
```bash
curl http://localhost:3000/api/analytics?type=pages&limit=10
```

### Get traffic sources
```bash
curl http://localhost:3000/api/analytics?type=sources
```

### Get realtime users
```bash
curl http://localhost:3000/api/analytics?type=realtime
```

---

## 🔐 Security Notes

- ✅ Service account has **read-only** access (Viewer role in GA4)
- ✅ JSON keys are gitignored (won't be committed)
- ✅ Environment variables are used for credentials
- ⚠️ Consider adding authentication to `/api/analytics` endpoint for production

---

## 📚 Useful Links

- **GA4 Property ID**: `506980538`
- **API Docs**: https://developers.google.com/analytics/devguides/reporting/data/v1
- **GA4 Metrics Reference**: https://developers.google.com/analytics/devguides/reporting/data/v1/api-schema

---

## 🐛 Troubleshooting

### Error: "GA4_SERVICE_ACCOUNT_KEY environment variable is not set"
- Make sure you've added the variable to `.env.local`
- Restart your dev server after adding environment variables

### Error: "Failed to parse GA4 service account credentials"
- Check that your base64 encoding is correct
- Make sure there are no newlines or spaces in the base64 string

### Error: "User does not have sufficient permissions"
- Make sure you added the service account email to your GA4 property
- Make sure you granted "Viewer" access in GA4 Admin → Property Access Management

### No data returned / Empty arrays
- Check that your GA4 property ID (506980538) is correct
- Make sure your property has data for the date range you're querying
- Try a wider date range (e.g., `90daysAgo`)
