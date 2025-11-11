#!/bin/bash
# Script to analyze AI consultant token usage from Vercel logs
# Usage: ./scripts/analyze-token-usage.sh [deployment-url]

DEPLOYMENT_URL=${1:-$(vercel ls | head -n 1)}

echo "📊 Analyzing token usage for: $DEPLOYMENT_URL"
echo "================================================"
echo ""

# Fetch logs and analyze token usage
vercel logs "$DEPLOYMENT_URL" 2>/dev/null | \
  grep "📊 Token Usage:" | \
  tail -n 50 | \
  awk '{
    if (match($0, /"input_tokens":([0-9]+)/)) {
      input += substr($0, RSTART+16, RLENGTH-16)
    }
    if (match($0, /"output_tokens":([0-9]+)/)) {
      output += substr($0, RSTART+17, RLENGTH-17)
    }
    count++
  }
  END {
    if (count > 0) {
      total = input + output
      print "Total API calls: " count
      print "Input tokens:    " input
      print "Output tokens:   " output
      print "Total tokens:    " total
      print ""
      print "Average tokens per call: " int(total/count)
      print ""
      print "Estimated cost (Haiku rates):"
      print "  Input:  $" sprintf("%.4f", input * 0.00000025)
      print "  Output: $" sprintf("%.4f", output * 0.00000125)
      print "  Total:  $" sprintf("%.4f", (input * 0.00000025) + (output * 0.00000125))
    } else {
      print "No token usage data found in recent logs"
      print "Note: This only shows data from recent activity"
    }
  }'

echo ""
echo "================================================"
echo "Note: For complete monthly usage, check Anthropic Console:"
echo "https://console.anthropic.com/settings/usage"
