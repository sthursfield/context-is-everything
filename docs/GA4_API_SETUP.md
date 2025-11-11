# GA4 API Setup Guide

## Property ID: 506980538

This guide will walk you through setting up Google Analytics 4 (GA4) API access for the Context is Everything website.

---

## Part 1: Create Google Cloud Project & Enable GA4 API

### Step 1: Go to Google Cloud Console
1. Visit: https://console.cloud.google.com/
2. Sign in with the Google account that has access to your GA4 property

### Step 2: Create a New Project (or select existing)
1. Click the project dropdown at the top
2. Click "NEW PROJECT"
3. Name it: `Context-is-Everything-Analytics`
4. Click "CREATE"

### Step 3: Enable Google Analytics Data API
1. In the search bar, type: "Google Analytics Data API"
2. Click on "Google Analytics Data API"
3. Click "ENABLE"
4. Wait for it to enable (takes ~30 seconds)

---

## Part 2: Create Service Account (For Server-Side Access)

### Step 4: Create Service Account
1. In Google Cloud Console, go to: **IAM & Admin → Service Accounts**
   - Direct link: https://console.cloud.google.com/iam-admin/serviceaccounts
2. Click "CREATE SERVICE ACCOUNT"
3. Fill in:
   - **Service account name**: `ga4-analytics-reader`
   - **Service account ID**: (auto-filled)
   - **Description**: `Service account for reading GA4 analytics data`
4. Click "CREATE AND CONTINUE"

### Step 5: Grant Access (Skip this step)
1. Click "CONTINUE" (no roles needed at project level)
2. Click "DONE"

### Step 6: Create Service Account Key
1. Find your new service account in the list
2. Click on it
3. Go to the "KEYS" tab
4. Click "ADD KEY" → "Create new key"
5. Select "JSON"
6. Click "CREATE"
7. **IMPORTANT**: A JSON file will download - keep this safe! You'll need it in Part 3.

---

## Part 3: Grant Service Account Access to GA4

### Step 7: Add Service Account to GA4
1. Go to Google Analytics: https://analytics.google.com/
2. Click "Admin" (gear icon, bottom left)
3. In the "Account" column, select your account
4. In the "Property" column, select your property (ID: 506980538)
5. Click "Property Access Management"
6. Click "+" (Add users)
7. Paste the service account email from the JSON file
   - It looks like: `ga4-analytics-reader@your-project.iam.gserviceaccount.com`
8. Select role: **Editor** (allows setting up dashboards in GA4)
9. Uncheck "Notify new users by email"
10. Click "Add"

---

## Part 4: Add Credentials to Your Project

### Step 8: Save Service Account Key
1. Open the downloaded JSON file
2. Copy the ENTIRE contents
3. Let me know when you're ready and I'll help you add it to the project securely

**Option A - Environment Variable (Recommended for Production)**
- We'll add the JSON as a base64-encoded environment variable

**Option B - Local File (For Development)**
- We'll save it to a secure location and gitignore it

---

## Part 5: Verification

Once credentials are added, we'll test the connection by:
1. Fetching basic analytics data (page views, users, sessions)
2. Verifying the property ID (506980538) is accessible
3. Creating a test dashboard to display the data

---

## Quick Reference

- **GA4 Property ID**: `506980538`
- **API Documentation**: https://developers.google.com/analytics/devguides/reporting/data/v1
- **Service Account Email**: (from your JSON file)
- **API Scopes Needed**: `https://www.googleapis.com/auth/analytics.readonly`

---

## Next Steps

1. Complete Steps 1-7 above
2. Download the JSON service account key
3. Let me know when you're ready, and I'll help you integrate it into the project
4. We'll create API endpoints and a dashboard to view your analytics

---

## Security Notes

- ✅ Service account has Editor access (allows dashboard setup in GA4)
- ✅ JSON key should NEVER be committed to git
- ✅ We'll use environment variables for production (Vercel)
- ✅ Local JSON file will be gitignored for development
