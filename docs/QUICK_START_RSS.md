# Quick Start: RSS Feed Integration

## Problem Summary

You encountered this error in n8n:
```
Unquoted attribute value Line: 16 Column: 24 Char: R
```

**Root Cause:** LinkedIn company pages (`https://www.linkedin.com/company/92768394`) do NOT provide RSS feeds. The URL returns HTML, which cannot be parsed as XML/RSS.

---

## Solutions (Choose One)

### ✅ Option 1: Use Working RSS Feeds (Easiest)

Replace the LinkedIn URL with actual RSS feeds:

**In n8n RSS Feed Read Node:**
- TechCrunch: `https://techcrunch.com/feed/`
- BBC News: `https://feeds.bbci.co.uk/news/rss.xml`
- Dev.to: `https://dev.to/feed`
- Reddit: `https://www.reddit.com/.rss`

**Import workflow:** `/workflows/n8n-rss-feed-workflow.json`

---

### 🔧 Option 2: LinkedIn via RSS Bridge (Advanced)

**Step 1:** Deploy RSS Bridge
```bash
docker run -d -p 3000:80 rssbridge/rss-bridge:latest
```

**Step 2:** Update n8n workflow
- Import: `/workflows/n8n-linkedin-integration.json`
- Update URL: `http://localhost:3000/?action=display&bridge=LinkedIn&context=Company&u=green-hub&format=Atom`
- Replace `green-hub` with your LinkedIn company username

**Step 3:** Use HTTP Request node instead of RSS Feed Read node

---

### 📱 Option 3: Use Portal Admin Panel (No n8n)

The Green Hub Portal now includes RSS feed management!

**Access:** `/src/admin/admin-panel.html`

**Steps:**
1. Open Admin Panel
2. Click "📡 RSS Feeds" tab
3. Add a working RSS feed:
   - Name: TechCrunch
   - URL: `https://techcrunch.com/feed/`
4. Click "🧪 Probar" to test
5. Click "Agregar Feed" to save
6. Click "🔄" to import news

---

### 🔑 Option 4: Official LinkedIn API (Recommended for Production)

**Requirements:**
- LinkedIn Developer Account
- OAuth 2.0 credentials
- API access approval

**Documentation:** https://docs.microsoft.com/en-us/linkedin/

**In n8n:**
- Use HTTP Request node with LinkedIn OAuth
- Endpoint: `https://api.linkedin.com/v2/organizationalEntityShareStatistics`

---

## Testing Your Solution

### 1. Test RSS Feed in Browser

Open the RSS URL in a browser. You should see XML like this:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Feed Title</title>
    <item>
      <title>Article Title</title>
      <link>https://...</link>
      <description>Content...</description>
    </item>
  </channel>
</rss>
```

✅ **If you see XML:** The feed is valid
❌ **If you see HTML:** Not an RSS feed (like LinkedIn pages)

### 2. Test in Portal Admin Panel

1. Go to `/src/admin/admin-panel.html`
2. Click "📡 RSS Feeds"
3. Enter URL and click "🧪 Probar"
4. Should show: "✅ Feed válido! Se encontraron X items"

### 3. Test in n8n

1. Import workflow from `/workflows/n8n-rss-feed-workflow.json`
2. Click "Execute Workflow"
3. Check for errors

---

## Common Errors & Fixes

| Error | Cause | Solution |
|-------|-------|----------|
| `Unquoted attribute value` | HTML instead of XML | Use RSS Bridge or find real RSS feed |
| `Feed not found` | Invalid URL | Verify URL returns XML in browser |
| `Request timeout` | Slow server | Increase timeout in settings |
| `CORS error` | Browser security | Use backend proxy or n8n |
| `SSL certificate error` | Invalid certificate | Enable "Ignore SSL Issues" |

---

## Implementation Checklist

- [ ] Choose solution (RSS feeds, RSS Bridge, or LinkedIn API)
- [ ] Test RSS feed URL in browser (should return XML)
- [ ] Update n8n workflow or use admin panel
- [ ] Test with sample feed first
- [ ] Configure polling interval (6-12 hours recommended)
- [ ] Set up error notifications
- [ ] Deploy to production
- [ ] Monitor for feed changes

---

## Files Created

### Utility Code
- `/src/utils/rssFeedParser.js` - RSS/Atom feed parser with error handling

### Documentation
- `/docs/RSS_FEED_INTEGRATION.md` - Complete integration guide
- `/docs/QUICK_START_RSS.md` - This file
- `/workflows/README.md` - n8n workflow documentation

### Workflows
- `/workflows/n8n-rss-feed-workflow.json` - Working RSS feed integration
- `/workflows/n8n-linkedin-integration.json` - LinkedIn via RSS Bridge

### Features
- `/src/admin/admin-panel.html` - Updated with RSS feed management tab

---

## Next Steps

1. **Test with working RSS feeds first**
   - Use TechCrunch or BBC News URLs
   - Verify data flows correctly

2. **For LinkedIn content:**
   - Deploy RSS Bridge (Docker required)
   - Or use official LinkedIn API
   - See `/docs/RSS_FEED_INTEGRATION.md` for details

3. **Automate updates:**
   - Schedule n8n workflow (every 6-12 hours)
   - Or use cron jobs with the RSS parser utility

4. **Monitor and maintain:**
   - Check for feed errors
   - Update feed URLs if they change
   - Review imported content quality

---

## Support Resources

- **Full Documentation:** `/docs/RSS_FEED_INTEGRATION.md`
- **n8n Workflows:** `/workflows/README.md`
- **RSS Parser Code:** `/src/utils/rssFeedParser.js`

---

## Quick Test Command

To test the RSS parser utility directly:

```javascript
// In browser console on your portal
import { parseFeed } from './src/utils/rssFeedParser.js';

const items = await parseFeed('https://techcrunch.com/feed/', {
  maxItems: 5
});

console.log(items);
```

---

**Remember:** LinkedIn company pages are NOT RSS feeds. Always test URLs in a browser first to verify they return XML!
