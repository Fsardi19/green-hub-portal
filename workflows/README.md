# n8n Workflows for Green Hub Portal

This directory contains n8n workflow configurations for automating RSS feed integration and LinkedIn content aggregation.

## Available Workflows

### 1. RSS Feed Integration (`n8n-rss-feed-workflow.json`)

**Purpose:** Automatically fetch and import news from multiple RSS feeds into the Green Hub Portal.

**Features:**
- Scheduled execution every 6 hours
- Multiple RSS feed sources (TechCrunch, BBC News, etc.)
- Automatic formatting for portal compatibility
- Error handling and notifications
- API integration for data push

**Setup:**
1. Import workflow into n8n
2. Update RSS feed URLs in the RSS Feed Read nodes
3. Configure Portal API endpoint in HTTP Request node
4. Set up Telegram credentials for notifications (optional)
5. Activate workflow

**Tested with:**
- TechCrunch: `https://techcrunch.com/feed/`
- BBC News: `https://feeds.bbci.co.uk/news/rss.xml`
- Dev.to: `https://dev.to/feed`

---

### 2. LinkedIn Integration via RSS Bridge (`n8n-linkedin-integration.json`)

**Purpose:** Import LinkedIn company updates using RSS Bridge as a middleware.

**Requirements:**
- RSS Bridge server (self-hosted or cloud)
- Docker (for RSS Bridge deployment)
- LinkedIn company page URL

**Setup:**

#### Step 1: Deploy RSS Bridge

Using Docker:
```bash
docker run -d \
  --name rss-bridge \
  -p 3000:80 \
  -v /path/to/config:/config \
  rssbridge/rss-bridge:latest
```

Using Docker Compose:
```yaml
version: '3'
services:
  rss-bridge:
    image: rssbridge/rss-bridge:latest
    container_name: rss-bridge
    ports:
      - "3000:80"
    volumes:
      - ./rss-bridge-config:/config
    restart: unless-stopped
```

#### Step 2: Configure RSS Bridge URL

In the workflow, update the URL in the "LinkedIn via RSS Bridge" node:
```
http://your-rss-bridge-server:3000/?action=display&bridge=LinkedIn&context=Company&u=company-name&format=Atom
```

Replace:
- `your-rss-bridge-server` with your RSS Bridge server address
- `company-name` with the LinkedIn company username

#### Step 3: Import Workflow
1. Open n8n
2. Import `n8n-linkedin-integration.json`
3. Update Portal API endpoint
4. Activate workflow

**Limitations:**
- RSS Bridge may break if LinkedIn changes their HTML structure
- Rate limiting may apply
- Consider LinkedIn's Terms of Service

---

## Configuration

### Portal API Endpoint

Both workflows expect a REST API endpoint to receive data:

**Endpoint:** `POST /api/news`

**Request Body:**
```json
{
  "items": [
    {
      "id": 1234567890,
      "title": "News Title",
      "content": "Full content...",
      "description": "Short description",
      "date": "2025-11-12",
      "link": "https://source.com/article",
      "source": "Source Name",
      "isNew": true,
      "category": "External News"
    }
  ]
}
```

**Expected Response:**
```json
{
  "success": true,
  "imported": 10
}
```

### Backend Implementation Example (Node.js/Express)

```javascript
const express = require('express');
const fs = require('fs').promises;

const app = express();
app.use(express.json());

app.post('/api/news', async (req, res) => {
  try {
    const { items } = req.body;

    // Read existing news
    const newsData = JSON.parse(
      await fs.readFile('./public/data/news.json', 'utf8')
    );

    // Add new items (avoiding duplicates)
    const existingIds = new Set(newsData.map(n => n.id));
    const newItems = items.filter(item => !existingIds.has(item.id));

    newsData.unshift(...newItems);

    // Save updated news
    await fs.writeFile(
      './public/data/news.json',
      JSON.stringify(newsData, null, 2)
    );

    res.json({
      success: true,
      imported: newItems.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.listen(3000, () => {
  console.log('API listening on port 3000');
});
```

---

## Troubleshooting

### "Unquoted attribute value" Error

**Cause:** Trying to parse HTML (not RSS/XML) with RSS Feed Read node.

**Solution:**
- Verify the URL returns XML by opening it in a browser
- For LinkedIn, use RSS Bridge workflow instead
- For other sites, check if they provide an RSS/Atom feed

### "Request timeout" Error

**Cause:** Feed server is slow or unresponsive.

**Solution:**
- Increase timeout in node settings (Options → Timeout)
- Check if feed URL is accessible
- Try again later

### "Feed not found" Error

**Cause:** Invalid URL or feed no longer exists.

**Solution:**
- Verify URL in browser
- Check if website still provides RSS feed
- Update URL if feed moved

### RSS Bridge Returns Empty Results

**Cause:** LinkedIn HTML structure changed, or rate limiting.

**Solution:**
- Check RSS Bridge logs: `docker logs rss-bridge`
- Update RSS Bridge to latest version
- Reduce polling frequency
- Consider using LinkedIn API instead

---

## Best Practices

1. **Polling Frequency**
   - Start with 6-12 hour intervals
   - Adjust based on feed update frequency
   - Respect rate limits

2. **Error Handling**
   - Always include error notifications
   - Log failures for debugging
   - Implement retry logic with exponential backoff

3. **Data Validation**
   - Sanitize HTML content before storing
   - Validate URLs
   - Check for duplicate entries

4. **Performance**
   - Limit items per fetch (10-20 items)
   - Cache feed results when possible
   - Use background jobs for heavy processing

5. **Security**
   - Never expose API credentials in workflows
   - Use environment variables for sensitive data
   - Validate and sanitize all input
   - Implement authentication on API endpoints

---

## Alternative Solutions

### If n8n is Not Available

1. **Direct Portal Integration**
   ```javascript
   // Use the included RSS parser utility
   import { parseFeed } from './src/utils/rssFeedParser.js';

   const items = await parseFeed('https://techcrunch.com/feed/');
   // Save to news.json
   ```

2. **Cron Job**
   ```bash
   # Add to crontab for scheduled execution
   0 */6 * * * node /path/to/fetch-rss.js
   ```

3. **GitHub Actions**
   ```yaml
   # .github/workflows/fetch-rss.yml
   name: Fetch RSS Feeds
   on:
     schedule:
       - cron: '0 */6 * * *'
   jobs:
     fetch:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - name: Fetch and update
           run: node scripts/fetch-rss.js
   ```

---

## Support

For issues or questions:
- Check the main documentation: `/docs/RSS_FEED_INTEGRATION.md`
- Review n8n community forums
- Check RSS Bridge documentation
- Open an issue in the repository

---

## License

These workflows are provided as-is for the Green Hub Portal project.
