# RSS Feed Integration Guide

## Problem: LinkedIn RSS Feed Error

### The Issue
When trying to use n8n's RSS Feed Read node with a LinkedIn company URL like:
```
https://www.linkedin.com/company/92768394
```

You'll encounter the error:
```
Unquoted attribute value Line: 16 Column: 24 Char: R
```

### Root Cause
**LinkedIn company pages do NOT provide RSS feeds.** The URL returns HTML (not XML/RSS), and the n8n RSS Feed Read node cannot parse HTML as XML.

---

## Solutions for LinkedIn Content Integration

### Option 1: Use RSS Bridge (Recommended for n8n)

**RSS Bridge** is an open-source tool that generates RSS feeds from websites that don't offer them.

#### Setup with Docker:
```bash
docker run -d -p 3000:80 rssbridge/rss-bridge:latest
```

#### n8n Workflow:
1. Replace RSS Feed Read node with **HTTP Request** node
2. URL: `http://your-rss-bridge:3000/?action=display&bridge=LinkedIn&context=Company&u=company-name&format=Atom`
3. Add **XML** node to parse the feed
4. Continue with your workflow

### Option 2: LinkedIn API (Official Method)

Use LinkedIn's official API with OAuth authentication.

#### n8n Workflow:
1. Set up LinkedIn OAuth credentials in n8n
2. Use **HTTP Request** node with authentication
3. Endpoint: `https://api.linkedin.com/v2/organizationalEntityShareStatistics`
4. Parse JSON response

**Requirements:**
- LinkedIn Developer Account
- OAuth 2.0 credentials
- API access approval

### Option 3: Third-Party RSS Services

#### RSS.app
- URL: https://rss.app
- Paid service
- Generates RSS feeds from LinkedIn profiles and company pages
- Works directly with n8n RSS Feed Read node

#### OpenRSS
- URL: https://openrss.org
- Free tier available
- Similar functionality

### Option 4: Direct Portal Integration (No n8n)

Use the RSS feed parser utility in this repository:

```javascript
import { parseFeed } from './src/utils/rssFeedParser.js';

// For actual RSS feeds (not LinkedIn)
const feedItems = await parseFeed('https://techcrunch.com/feed/', {
  maxItems: 10,
  timeout: 10000,
  sanitize: true
});

// Update your news.json
console.log(feedItems);
```

---

## n8n Workflow Examples

### Working RSS Feed Integration

```json
{
  "nodes": [
    {
      "name": "Schedule Trigger",
      "type": "n8n-nodes-base.scheduleTrigger",
      "parameters": {
        "rule": {
          "interval": [{ "field": "hours", "hoursInterval": 6 }]
        }
      }
    },
    {
      "name": "RSS Feed Read",
      "type": "n8n-nodes-base.rssFeedRead",
      "parameters": {
        "url": "https://techcrunch.com/feed/"
      }
    },
    {
      "name": "Format for Portal",
      "type": "n8n-nodes-base.function",
      "parameters": {
        "functionCode": "const items = [];\nfor (const item of $input.all()) {\n  items.push({\n    id: Date.now() + items.length,\n    title: item.json.title,\n    content: item.json.content,\n    date: new Date(item.json.pubDate).toISOString().split('T')[0],\n    link: item.json.link,\n    isNew: true\n  });\n}\nreturn items;"
      }
    },
    {
      "name": "HTTP Request",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "url": "https://your-portal.com/api/news",
        "method": "POST",
        "bodyParametersUi": {
          "parameter": [{ "name": "items", "value": "={{ $json }}" }]
        }
      }
    }
  ]
}
```

### LinkedIn with RSS Bridge

```json
{
  "nodes": [
    {
      "name": "Schedule Trigger",
      "type": "n8n-nodes-base.scheduleTrigger",
      "parameters": {
        "rule": {
          "interval": [{ "field": "hours", "hoursInterval": 12 }]
        }
      }
    },
    {
      "name": "HTTP Request - RSS Bridge",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "url": "http://rss-bridge:3000/?action=display&bridge=LinkedIn&context=Company&u=company-name&format=Atom",
        "method": "GET",
        "options": {
          "response": { "response": { "fullResponse": false } }
        }
      }
    },
    {
      "name": "XML",
      "type": "n8n-nodes-base.xml",
      "parameters": {
        "mode": "xmlToJson",
        "options": {}
      }
    }
  ]
}
```

---

## Recommended RSS Feeds for Testing

Use these working RSS feeds for testing your integration:

| Source | RSS URL | Update Frequency |
|--------|---------|------------------|
| TechCrunch | `https://techcrunch.com/feed/` | Hourly |
| BBC News | `https://feeds.bbci.co.uk/news/rss.xml` | Real-time |
| Dev.to | `https://dev.to/feed` | Continuous |
| Reddit | `https://www.reddit.com/.rss` | Real-time |
| Medium | `https://medium.com/feed/tag/technology` | Hourly |

---

## Integration Checklist

- [ ] Verify the URL is an actual RSS/Atom feed (not HTML page)
- [ ] Test feed URL in browser - should show XML
- [ ] Configure n8n with correct RSS URL
- [ ] Set appropriate polling interval (avoid rate limits)
- [ ] Add error handling for failed requests
- [ ] Validate XML structure before parsing
- [ ] Sanitize content for security
- [ ] Test with sample feeds before production
- [ ] Monitor for feed format changes

---

## Troubleshooting

### "Unquoted attribute value" Error
- **Cause**: Trying to parse HTML as XML
- **Fix**: Ensure URL returns RSS/Atom XML, not HTML

### "Feed not found" Error
- **Cause**: Invalid URL or feed no longer exists
- **Fix**: Verify feed URL in browser

### "Request timeout" Error
- **Cause**: Slow feed server
- **Fix**: Increase timeout in n8n node settings

### "SSL Certificate Error"
- **Cause**: Invalid or self-signed SSL certificate
- **Fix**: Enable "Ignore SSL Issues" in n8n RSS node options

---

## For Green Hub Portal Developers

To integrate RSS feeds into the portal:

1. **Import the parser utility:**
   ```javascript
   import { parseFeed, isValidFeedURL } from './src/utils/rssFeedParser.js';
   ```

2. **Add to admin panel:**
   - Create RSS feed management interface
   - Allow admins to add/remove feed sources
   - Schedule automatic feed updates

3. **Backend implementation:**
   - Create API endpoint: `/api/feeds/fetch`
   - Store feed sources in database/config
   - Run scheduled jobs to update content

4. **Frontend display:**
   - Merge RSS items with manual news
   - Add source attribution
   - Filter by category/source

---

## Security Considerations

- Always sanitize RSS feed content before displaying
- Validate URLs to prevent SSRF attacks
- Set reasonable timeouts for feed requests
- Rate limit feed fetching to avoid abuse
- Consider caching feed results
- Review third-party service privacy policies

---

## Additional Resources

- [RSS 2.0 Specification](https://www.rssboard.org/rss-specification)
- [Atom Specification](https://www.rfc-editor.org/rfc/rfc4287)
- [n8n RSS Feed Read Node Docs](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.rssfeedread/)
- [RSS Bridge Documentation](https://rss-bridge.github.io/rss-bridge/)
- [LinkedIn API Documentation](https://docs.microsoft.com/en-us/linkedin/)
