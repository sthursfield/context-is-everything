# SEO Action Plan: Context is Everything

**Last Updated:** October 20, 2025
**Status:** Ready for submission with 10 articles + 3 case studies

---

## ✅ COMPLETED: Technical Foundation

### 1. Sitemap Generation
- ✅ **Updated sitemap.ts** with all 10 articles
- ✅ **Live sitemap URL:** https://www.context-is-everything.com/sitemap.xml
- ✅ **Includes:**
  - Homepage (priority 1.0)
  - 10 thought leadership articles (priority 0.8)
  - 3 case studies (priority 0.9)
  - Legal pages (privacy, cookies)

### 2. Internal Linking (SEO Critical)
- ✅ **Related Articles Component** created and deployed
- ✅ **Benefits:**
  - Distributes page authority throughout site
  - Reduces bounce rate (keeps users engaged)
  - Helps search engines understand content relationships
  - Increases pages per session (positive ranking signal)
- ✅ **Implementation:**
  - 3 related articles shown at bottom of each article
  - Clean card design with hover effects
  - All 10 articles have related_content configured

### 3. Robots.txt
- ✅ **Configured** and allows all major search engines
- ✅ **AI crawler friendly** (GPTBot, Claude-Web, PerplexityBot, etc.)
- ✅ **Sitemap referenced** in robots.txt

### 4. Schema Markup
- ✅ **Structured data** implemented for all articles
- ✅ **Organization schema** for company info
- ⏳ **Need to validate** with Google Rich Results Test (see Week 1 tasks)

---

## 📋 IMMEDIATE ACTIONS (This Week)

### Week 1: Search Engine Submission

#### 🎯 Day 1-2: Google Search Console Setup

**Steps:**
1. Go to https://search.google.com/search-console
2. Add property: `www.context-is-everything.com`
3. Verify ownership (use DNS method or HTML file upload)
4. Submit sitemap: `https://www.context-is-everything.com/sitemap.xml`
5. Request manual indexing for key pages:
   - Homepage
   - All 10 article URLs (use URL Inspection tool)
   - 3 case study URLs

**Priority URLs to Index First:**
```
https://www.context-is-everything.com/insights/7-ai-mistakes-costing-uk-businesses
https://www.context-is-everything.com/insights/ai-native-buyers-marketing-gap
https://www.context-is-everything.com/insights/why-ai-projects-fail
https://www.context-is-everything.com/insights/information-asymmetry-buying-ia-vs-ai
https://www.context-is-everything.com/insights/where-to-start-with-ai
```

#### 🎯 Day 3-4: Bing Webmaster Tools Setup

**Steps:**
1. Go to https://www.bing.com/webmasters
2. Add site: `www.context-is-everything.com`
3. Verify ownership
4. Submit sitemap: `https://www.context-is-everything.com/sitemap.xml`
5. Submit individual URLs for faster indexing

**Note:** Bing powers DuckDuckGo, Ecosia, and other search engines

#### 🎯 Day 5: Schema Validation

**Test these URLs:**
1. Google Rich Results Test: https://search.google.com/test/rich-results
2. Schema.org Validator: https://validator.schema.org/

**URLs to validate:**
- Homepage: https://www.context-is-everything.com/
- Article example: https://www.context-is-everything.com/insights/ai-native-buyers-marketing-gap
- Case study example: https://www.context-is-everything.com/case-studies/insurance-brokerage-transformation

**Fix any errors reported**

#### 🎯 Day 6-7: LinkedIn Article Publication

**Strategy:** Republish on LinkedIn 2 weeks AFTER live on your site (avoids duplicate content penalty)

**First 3 Articles to Publish:**
1. **"7 AI Mistakes Costing UK Businesses £50K+"** (Article 9)
   - High engagement potential (data-driven, UK-specific)
   - Tag: #AI #AIImplementation #UKBusiness #DigitalTransformation

2. **"Your Buyers Are AI-Native. Is Your Marketing?"** (Article 10)
   - Forrester research = credibility boost
   - Tag: #B2BMarketing #AIMarketing #MarketingLeadership #Forrester

3. **"Why AI Projects Fail"** (Article 1)
   - Evergreen topic, foundational content
   - Tag: #ArtificialIntelligence #ProjectManagement #AIStrategy

**LinkedIn Publishing Process:**
1. Use LinkedIn's native article feature (not just a post)
2. LinkedIn auto-adds canonical link back to your site
3. Add 2-3 relevant hashtags
4. Engage with comments to boost visibility
5. Share to relevant LinkedIn groups (AI, consulting, B2B marketing)

---

## 📊 Week 2-4: Content Amplification

### Content Marketing Channels

#### A. Guest Posting / Contributed Articles

**Target Publications:**
- **TechCrunch UK** - Tech startups, AI adoption
- **Diginomica** - Enterprise technology
- **ComputerWeekly.com** - IT leadership, UK audience
- **CIO.com** - C-level tech decision makers
- **Harvard Business Review** - Premium if you can get in

**Pitch Angles:**
1. "Why 42% of UK SMEs Abandoned AI (And What We Can Learn)"
   - Data-driven, UK-specific statistics
   - Timely/newsworthy angle

2. "The £50K AI Mistake Pattern: A Consulting Insider's View"
   - Insider perspective, specific cost figures
   - Practical advice for decision-makers

3. "Information Asymmetry: The Hidden Force Killing AI Projects"
   - Academic angle (Akerlof's Nobel Prize research)
   - Unique framework approach

#### B. Industry Forum Participation

**High-Authority Communities:**
- **Hacker News** (news.ycombinator.com) - Technical, startup audience
- **Reddit:**
  - r/artificial
  - r/MachineLearning
  - r/consulting
  - r/entrepreneur
- **IndieHackers.com** - Startup founders, practical focus
- **GrowthHackers.com** - Marketing leaders

**Strategy:**
- ⚠️ Don't spam links
- Provide genuine value in discussions first
- Build reputation before sharing content
- Only share when directly relevant to discussion

#### C. Podcast Appearances

**Target Podcasts:**
1. **"AI in Business"** - B2B AI adoption focus
2. **"The Marketing AI Show"** - Marketing leader audience
3. **"Practical AI"** (Changelog) - Developer/practitioner audience
4. **"Machine Learning Street Talk"** - More technical, thought leadership

**Talking Points from Your Articles:**
- Information asymmetry framework (unique angle)
- The 90/20 gap (buyers vs. marketing AI adoption)
- The 7 mistakes pattern (UK-specific data)
- Forrester research insights

---

## 🔧 Month 2-3: Technical SEO Enhancements

### Page Speed Optimization

**Current Status:** ✅ Excellent (299ms load time)

**Verify Core Web Vitals:**
- PageSpeed Insights: https://pagespeed.web.dev/
- GTmetrix: https://gtmetrix.com/
- Target: All metrics in "Good" range (green)

**Optimization Checklist:**
- ✅ Next.js Image component (automatic optimization)
- ✅ Static generation (fast page loads)
- ⏳ Verify WebP images for hero images
- ⏳ Add descriptive alt text to all images

### Image SEO Audit

**Check Each Hero Image:**
1. Format: WebP preferred (smaller file size)
2. Compression: Under 200KB ideally
3. Alt text: Descriptive, includes target keywords
4. Title attribute: Article title

**Example:**
```html
<img
  src="/assets/7-ai-mistakes-carousel/1_The Boom.png"
  alt="7 AI Mistakes Costing UK Small Businesses £50K+ - Common AI implementation failures and how to avoid them"
  title="7 AI Mistakes Costing UK Businesses £50K+"
/>
```

### Mobile Optimization

**Test Tools:**
- Google Mobile-Friendly Test: https://search.google.com/test/mobile-friendly
- Real device testing (iOS Safari, Android Chrome)

**Checklist:**
- ✅ Responsive design (Next.js Tailwind CSS)
- ⏳ Test touch targets (buttons, links easily tappable)
- ⏳ Verify text readability without zooming
- ⏳ Check hero images display correctly on mobile

---

## 🔗 Month 3-6: Authority Building (Backlinks)

### Business Directories

**High-Value Listings:**

**A. General Business:**
- Clutch.co (AI consulting category) - **HIGH PRIORITY**
- GoodFirms.co
- Featured.com
- Expertise.com

**B. UK-Specific:**
- UK Business Directory
- Approved Business
- Touch Local
- Yell.com

**C. AI/Tech Directories:**
- AI Business Directory
- TopAITools.com
- There's An AI For That
- AI Tool Guru

**D. Professional Citations:**
- Forrester's consulting directory
- Gartner Peer Insights
- G2 Crowd (if applicable)
- Capterra

**Process for Each Directory:**
1. Create complete profile (logo, description, contact)
2. Link back to www.context-is-everything.com
3. Add case studies where possible
4. Request client reviews (if allowed)

### Content Partnerships

**Strategy:**
- Partner with complementary (non-competing) consultancies
- Co-create content (webinars, whitepapers, research)
- Cross-link from partner sites
- Share audiences

**Example Partnership:**
- **You:** AI strategy and implementation consulting
- **Partner:** Technology infrastructure firm
- **Co-Created Asset:** "The Complete AI Implementation Guide: Strategy to Infrastructure"
- **Result:** Both sites link to shared resource, both benefit from SEO

### PR and Media Mentions

**Leverage Your Data:**
- "Study reveals 42% of UK SMEs abandoned AI projects" → Tech journalists
- Create infographics from "7 Mistakes" article → Visual content sites
- Pitch to journalists covering AI adoption

**HARO (Help A Reporter Out):**
- Sign up: https://www.helpareporter.com/
- Respond to journalist queries about AI, consulting, B2B marketing
- Get quoted in articles → high-authority backlinks

---

## 🎬 Advanced Content Strategy (Ongoing)

### Video Content for YouTube

**Why:** YouTube is 2nd largest search engine (owned by Google)

**Content Ideas:**
1. **"7 AI Mistakes Costing UK Businesses £50K+"**
   - Animated explainer video (3-5 minutes)
   - Carousel images = natural storyboard

2. **"Information Asymmetry in AI Consulting"**
   - Whiteboard explanation (8-10 minutes)
   - Akerlof's lemon market theory → AI consulting

3. **Case Study Walkthrough**
   - Insurance brokerage transformation (real client story)
   - Screen recordings + talking head

4. **"AI Buyer's Guide" Series**
   - 5 episodes, 3-5 minutes each
   - Based on Article 7 ("Where to Start with AI")

**SEO Benefits:**
- YouTube videos rank in Google search results
- Embedded videos increase time on site
- Video transcripts = more searchable content
- Backlinks from YouTube to your site

### Webinar Series

**Topics from Your Articles:**

1. **"Is Your Marketing Ready for AI-Native Buyers?"**
   - Based on Article 10
   - Target audience: B2B marketing leaders
   - Include Forrester research insights

2. **"Avoiding the £50K AI Mistakes"**
   - Based on Article 9
   - Target audience: UK SME decision makers
   - Interactive Q&A

3. **"The Complete Cost of AI Implementation"**
   - Based on Article 4
   - Target audience: CFOs, budget owners
   - Cost calculator tool demo

**SEO Benefits:**
- Registration pages = more indexed content
- Webinar replays = long-form video content
- Attendee emails = lead gen + potential backlinks (if they share)
- Partner co-hosting = cross-promotion + backlinks

### Interactive Tools (HIGH Backlink Potential)

**Tools to Build:**

1. **"AI Project Cost Calculator"**
   - Based on Articles 3, 4 (cost articles)
   - Input: project scope, team size, timeline
   - Output: Estimated total cost breakdown
   - **Why it works:** Other sites will link to useful tools

2. **"AI Readiness Assessment"**
   - Based on Article 10 (Forrester's 5-pillar framework)
   - 15-20 questions across 5 dimensions
   - Detailed report with recommendations
   - **Lead gen:** Require email for full results

3. **"Information Asymmetry Analyzer"**
   - Input vendor claims/proposals
   - AI analyzes for red flags, inconsistencies
   - Based on Article 8 framework
   - **Press-worthy:** Unique, newsworthy tool

**Implementation:**
- Simple web forms (React components)
- Logic in JavaScript (client-side or API route)
- Results shareable (social sharing buttons)
- Lead capture (email for detailed PDF report)

**SEO Power:**
- Tools get linked naturally (other sites reference them)
- Keep users on site 5-10 minutes (strong engagement signal)
- Generate social shares
- Press coverage: "Consultancy launches free AI cost calculator"

### Original Research/Surveys

**Example Survey:**
"UK AI Adoption Study 2025: Survey of 500 UK Businesses"

**Questions to Ask:**
- Current AI usage and tools
- Budget allocated to AI projects
- Success rate of AI implementations
- Challenges faced
- Plans for next 12 months

**Why This Works:**
1. **Citations:** Journalists and researchers link to original data
2. **Authority:** Positions you as thought leader
3. **PR:** "New study reveals 60% of UK businesses..."
4. **Content:** Generates multiple articles from one dataset
5. **Backlinks:** Everyone wants to cite original research

**Tools:**
- SurveyMonkey, Typeform, Google Forms
- Target: 200-500 respondents (statistically significant)
- Promote through LinkedIn, industry groups
- Publish full report on your site (PDF download)

---

## 📈 Measurement & Analytics

### Setup Required

**1. Google Analytics 4 (GA4)**
- If not already set up
- Track: organic traffic, conversions, user behavior
- Set up conversion goals: contact form submissions

**2. Google Search Console**
- **REQUIRED** for sitemap submission
- Track: keyword rankings, impressions, clicks
- Identify: crawl errors, indexing issues

**3. Bing Webmaster Tools**
- **REQUIRED** for Bing sitemap
- Similar metrics to Google Search Console
- Important: Bing powers DuckDuckGo, Ecosia

### Key Metrics to Track

**Monthly SEO Scorecard:**

| Metric | Tool | Target |
|--------|------|--------|
| Organic sessions | GA4 | +15% month-over-month |
| Top 10 keywords ranking | Search Console | 20+ keywords by Month 3 |
| Average position | Search Console | Under 20 (first 2 pages) |
| Total impressions | Search Console | 10,000+ by Month 3 |
| Click-through rate (CTR) | Search Console | 3-5% average |
| Pages per session | GA4 | 2.5+ (internal linking goal) |
| Bounce rate | GA4 | Under 60% |
| Time on page | GA4 | 2+ minutes for articles |
| New backlinks | Ahrefs/SEMrush | 5+ quality links/month |
| Domain Authority (DA) | Moz/Ahrefs | Gradual increase |

### Backlink Tracking

**Free Tool:** Ubersuggest (limited free version)
**Paid Tools:** Ahrefs, SEMrush, Moz (most comprehensive)

**Track:**
- Total backlinks
- Referring domains (unique sites linking to you)
- Domain Authority of linking sites
- New vs. lost backlinks
- Anchor text distribution

---

## 🎯 Target Keywords by Article

### Primary Keywords (High Commercial Intent)

1. **AI consulting UK**
   - Volume: ~1,000/month
   - Competition: High
   - Article: Homepage, Article 1, 7

2. **AI implementation consultant**
   - Volume: ~500/month
   - Competition: Medium
   - Article: Article 1, 7, 9

3. **Why AI projects fail**
   - Volume: ~800/month
   - Competition: Medium
   - Article: Article 1, 9

4. **AI project costs**
   - Volume: ~400/month
   - Competition: Medium
   - Article: Article 3, 4, 9

5. **B2B marketing AI readiness**
   - Volume: ~200/month
   - Competition: Low
   - Article: Article 10

### Secondary Keywords (Informational)

6. **Information asymmetry AI consulting** (Low competition - unique!)
7. **AI mistakes businesses make**
8. **Hidden costs of AI implementation**
9. **When to hire AI consultant**
10. **AI-native buyers**

### Long-Tail Keywords (Easier to Rank)

11. **How much does AI implementation cost UK**
12. **AI consulting for small businesses UK**
13. **Why do 42% of AI projects fail** (Your unique stat!)
14. **B2B buyers using AI for research**
15. **Intelligence augmentation vs artificial intelligence**

**Strategy:**
- Start with long-tail (easier wins)
- Build authority with secondary keywords
- Eventually compete for primary keywords

---

## ✅ 30-Day Priority Checklist

### Week 1: Foundation
- [ ] Submit sitemap to Google Search Console
- [ ] Submit sitemap to Bing Webmaster Tools
- [ ] Validate schema markup (3 URLs minimum)
- [ ] Request indexing for 10 article URLs
- [ ] Verify Related Articles component works on live site

### Week 2: Content Amplification
- [ ] Publish Article 9 on LinkedIn
- [ ] Set up Google Analytics goals (contact form tracking)
- [ ] Add internal links between related articles (beyond component)
- [ ] Run PageSpeed Insights audit, fix any issues
- [ ] Add descriptive alt text to all hero images

### Week 3: Authority Building
- [ ] Submit to Clutch.co (high priority)
- [ ] Submit to 4 more business directories
- [ ] Publish Article 10 on LinkedIn
- [ ] Create infographic from Article 9 (7 Mistakes)
- [ ] Pitch guest post to 3 publications

### Week 4: Measurement & Optimization
- [ ] Publish Article 1 on LinkedIn
- [ ] Analyze first month Google Search Console data
- [ ] Identify top-performing articles (traffic)
- [ ] Create "Related Articles" series links in content
- [ ] Draft outline for first webinar

---

## 🚀 Quick Wins (Do Today!)

1. **✅ Sitemap Updated** - Ready to submit
2. **✅ Related Articles Component** - Deployed
3. **⏳ Google Search Console** - Submit sitemap (15 min)
4. **⏳ Bing Webmaster Tools** - Submit sitemap (15 min)
5. **⏳ Test Rich Results** - Validate schema (10 min)
6. **⏳ LinkedIn Article** - Publish Article 9 (30 min)

---

## 📞 Questions to Consider

1. **Budget for SEO Tools?**
   - Free tier: Google tools, Ubersuggest (limited)
   - Paid tier: Ahrefs ($99/mo), SEMrush ($119/mo), Moz ($99/mo)
   - Recommendation: Start free, upgrade Month 3 if budget allows

2. **Content Creation Capacity?**
   - Videos require production time/budget
   - Webinars require time commitment
   - Tools require development resources
   - Prioritize based on resources available

3. **Partnership Opportunities?**
   - Do you know complementary consultancies?
   - Existing client relationships for case studies?
   - Industry connections for podcast appearances?

---

## 📚 Resources

### SEO Learning
- **Google Search Central:** https://developers.google.com/search
- **Moz Beginner's Guide:** https://moz.com/beginners-guide-to-seo
- **Ahrefs Blog:** https://ahrefs.com/blog

### Tools
- **Sitemap:** https://www.context-is-everything.com/sitemap.xml ✅
- **Robots.txt:** https://www.context-is-everything.com/robots.txt ✅
- **PageSpeed:** https://pagespeed.web.dev/
- **Schema Validator:** https://validator.schema.org/

### Submission Links
- **Google Search Console:** https://search.google.com/search-console
- **Bing Webmaster:** https://www.bing.com/webmasters
- **HARO:** https://www.helpareporter.com/

---

## 🎯 Success Metrics (6 Month Goals)

**Traffic:**
- 5,000+ monthly organic sessions
- 20+ keywords ranking in top 10
- 50+ keywords ranking in top 50

**Authority:**
- Domain Authority (DA) 30+ (start ~15-20)
- 50+ quality backlinks
- Featured in 3+ industry publications

**Engagement:**
- 2.5+ pages per session
- 2+ minute average time on page
- Under 55% bounce rate

**Conversions:**
- 20+ contact form submissions/month from organic
- 10+ qualified leads/month

---

**Next Steps:** Start with Week 1 checklist above. Let me know when you've completed Google/Bing submission and I can help with the next phase!
