/**
 * RSS Feed Parser Utility
 * Handles RSS/Atom feed parsing with robust error handling
 * for the Green Hub Portal
 */

/**
 * Parse RSS/Atom feed from URL
 * @param {string} feedUrl - The RSS feed URL
 * @param {object} options - Parsing options
 * @returns {Promise<Array>} Parsed feed items
 */
export async function parseFeed(feedUrl, options = {}) {
  const {
    maxItems = 10,
    timeout = 10000,
    ignoreSSL = false,
    sanitize = true
  } = options;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(feedUrl, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/rss+xml, application/atom+xml, application/xml, text/xml'
      }
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const contentType = response.headers.get('content-type');
    if (!contentType?.includes('xml')) {
      throw new Error('Response is not XML/RSS format. LinkedIn company pages do not provide RSS feeds.');
    }

    const xmlText = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');

    // Check for XML parsing errors
    const parseError = xmlDoc.querySelector('parsererror');
    if (parseError) {
      throw new Error(`XML parsing error: ${parseError.textContent}`);
    }

    // Detect feed type (RSS or Atom)
    const isAtom = xmlDoc.querySelector('feed');
    const items = isAtom
      ? parseAtomFeed(xmlDoc, maxItems, sanitize)
      : parseRSSFeed(xmlDoc, maxItems, sanitize);

    return items;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Feed request timeout');
    }
    throw error;
  }
}

/**
 * Parse RSS 2.0 feed
 * @private
 */
function parseRSSFeed(xmlDoc, maxItems, sanitize) {
  const items = xmlDoc.querySelectorAll('item');
  const feedItems = [];

  for (let i = 0; i < Math.min(items.length, maxItems); i++) {
    const item = items[i];

    const title = getElementText(item, 'title');
    const link = getElementText(item, 'link');
    const description = getElementText(item, 'description');
    const pubDate = getElementText(item, 'pubDate');
    const content = getElementText(item, 'content:encoded') || description;

    feedItems.push({
      id: feedItems.length + 1,
      title: sanitize ? sanitizeHTML(title) : title,
      content: sanitize ? sanitizeHTML(content) : content,
      description: sanitize ? sanitizeHTML(description) : description,
      link: link,
      date: parseDate(pubDate),
      pubDate: pubDate,
      isNew: isRecent(pubDate)
    });
  }

  return feedItems;
}

/**
 * Parse Atom feed
 * @private
 */
function parseAtomFeed(xmlDoc, maxItems, sanitize) {
  const entries = xmlDoc.querySelectorAll('entry');
  const feedItems = [];

  for (let i = 0; i < Math.min(entries.length, maxItems); i++) {
    const entry = entries[i];

    const title = getElementText(entry, 'title');
    const linkEl = entry.querySelector('link[rel="alternate"]') || entry.querySelector('link');
    const link = linkEl?.getAttribute('href') || '';
    const summary = getElementText(entry, 'summary');
    const content = getElementText(entry, 'content') || summary;
    const published = getElementText(entry, 'published') || getElementText(entry, 'updated');

    feedItems.push({
      id: feedItems.length + 1,
      title: sanitize ? sanitizeHTML(title) : title,
      content: sanitize ? sanitizeHTML(content) : content,
      description: sanitize ? sanitizeHTML(summary) : summary,
      link: link,
      date: parseDate(published),
      pubDate: published,
      isNew: isRecent(published)
    });
  }

  return feedItems;
}

/**
 * Get text content from element
 * @private
 */
function getElementText(parent, tagName) {
  const element = parent.querySelector(tagName);
  return element?.textContent?.trim() || '';
}

/**
 * Parse various date formats
 * @private
 */
function parseDate(dateString) {
  if (!dateString) return new Date().toISOString().split('T')[0];

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return new Date().toISOString().split('T')[0];
    }
    return date.toISOString().split('T')[0];
  } catch (e) {
    return new Date().toISOString().split('T')[0];
  }
}

/**
 * Check if date is within last 7 days
 * @private
 */
function isRecent(dateString) {
  try {
    const date = new Date(dateString);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return date >= weekAgo;
  } catch (e) {
    return false;
  }
}

/**
 * Sanitize HTML content
 * @private
 */
function sanitizeHTML(html) {
  if (!html) return '';

  const temp = document.createElement('div');
  temp.textContent = html;
  let sanitized = temp.innerHTML;

  // Remove script tags and dangerous attributes
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  sanitized = sanitized.replace(/on\w+="[^"]*"/g, '');

  return sanitized;
}

/**
 * Validate RSS feed URL format
 * @param {string} url - URL to validate
 * @returns {boolean}
 */
export function isValidFeedURL(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch (e) {
    return false;
  }
}

/**
 * Get LinkedIn RSS feed alternatives
 * Note: LinkedIn doesn't provide native RSS feeds for company pages
 * @returns {object} Information about LinkedIn feed alternatives
 */
export function getLinkedInFeedAlternatives() {
  return {
    nativeRSS: false,
    message: 'LinkedIn company pages do not provide RSS feeds',
    alternatives: [
      {
        name: 'LinkedIn API',
        description: 'Use official LinkedIn API with OAuth authentication',
        url: 'https://docs.microsoft.com/en-us/linkedin/',
        requiresAuth: true
      },
      {
        name: 'RSS Bridge',
        description: 'Self-hosted service to generate RSS feeds from LinkedIn',
        url: 'https://github.com/RSS-Bridge/rss-bridge',
        requiresSetup: true
      },
      {
        name: 'RSS.app',
        description: 'Third-party service to create RSS feeds from LinkedIn',
        url: 'https://rss.app',
        isPaid: true
      },
      {
        name: 'Manual Integration',
        description: 'Use n8n HTTP Request node with LinkedIn scraping (check ToS)',
        requiresCompliance: true
      }
    ]
  };
}

/**
 * Example RSS feeds for testing
 */
export const sampleFeeds = {
  techCrunch: 'https://techcrunch.com/feed/',
  bbc: 'https://feeds.bbci.co.uk/news/rss.xml',
  reddit: 'https://www.reddit.com/.rss',
  medium: 'https://medium.com/feed/@username',
  devTo: 'https://dev.to/feed'
};
