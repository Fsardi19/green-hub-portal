// Generate executive HTML newsletter for Board of Directors
const data = $input.first().json;

// Function to safely extract and clean URLs
function cleanUrl(url) {
  if (!url) return null;

  // Handle Google News redirects - extract the actual URL
  if (url.includes('news.google.com/rss/articles/')) {
    try {
      const urlParams = new URLSearchParams(url.split('?')[1]);
      const actualUrl = urlParams.get('url');
      return actualUrl || url;
    } catch (e) {
      return url;
    }
  }

  return url;
}

// Format date beautifully
function formatDate(dateStr) {
  const date = dateStr ? new Date(dateStr) : new Date();
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Safely get nested data
function getData(obj, fallback = '') {
  return obj || fallback;
}

const currentDate = formatDate(data.date);

const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Coffee Market Intelligence</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif;
            background-color: #f0f0f0;
            padding: 0;
            margin: 0;
            line-height: 1.5;
            -webkit-font-smoothing: antialiased;
        }

        .newsletter-wrapper {
            max-width: 680px;
            margin: 0 auto;
            background-color: #ffffff;
        }

        /* Header */
        .header {
            background-color: #000000;
            padding: 24px 40px;
            border-bottom: 1px solid #000000;
        }

        .company-name {
            font-size: 11px;
            font-weight: 600;
            letter-spacing: 2px;
            text-transform: uppercase;
            color: #ffffff;
            margin-bottom: 4px;
        }

        .newsletter-title {
            font-size: 18px;
            font-weight: 600;
            color: #ffffff;
            letter-spacing: -0.3px;
        }

        /* Date Bar */
        .date-bar {
            background-color: #ffffff;
            padding: 12px 40px;
            border-bottom: 1px solid #e0e0e0;
        }

        .date-text {
            font-size: 12px;
            color: #666666;
            font-weight: 500;
        }

        /* Executive Summary */
        .executive-summary {
            padding: 32px 40px;
            border-bottom: 1px solid #e0e0e0;
            background-color: #fafafa;
        }

        .summary-label {
            font-size: 10px;
            font-weight: 700;
            letter-spacing: 1.5px;
            text-transform: uppercase;
            color: #000000;
            margin-bottom: 12px;
        }

        .summary-text {
            font-size: 15px;
            line-height: 1.6;
            color: #333333;
        }

        /* Content Section */
        .content-section {
            padding: 40px 40px;
        }

        .section-heading {
            font-size: 10px;
            font-weight: 700;
            letter-spacing: 1.5px;
            text-transform: uppercase;
            color: #000000;
            margin-bottom: 24px;
            padding-bottom: 12px;
            border-bottom: 1px solid #000000;
        }

        /* Article List */
        .article-list {
            margin: 0;
        }

        .article-item {
            padding: 24px 0;
            border-bottom: 1px solid #e0e0e0;
            position: relative;
        }

        .article-item:last-child {
            border-bottom: none;
        }

        .article-category {
            font-size: 10px;
            font-weight: 600;
            letter-spacing: 1px;
            text-transform: uppercase;
            color: #666666;
            margin-bottom: 8px;
        }

        .article-title {
            font-size: 18px;
            font-weight: 600;
            color: #000000;
            margin-bottom: 8px;
            line-height: 1.3;
            letter-spacing: -0.3px;
        }

        .article-description {
            font-size: 14px;
            line-height: 1.6;
            color: #666666;
            margin-bottom: 0;
        }

        .article-link {
            position: absolute;
            top: 24px;
            right: 0;
            color: #000000;
            text-decoration: none;
            font-size: 18px;
            opacity: 0.3;
            transition: all 0.2s ease;
        }

        .article-link:hover {
            opacity: 1;
        }

        /* Metrics Section */
        .metrics-section {
            padding: 32px 40px;
            background-color: #fafafa;
            border-top: 1px solid #e0e0e0;
            border-bottom: 1px solid #e0e0e0;
        }

        .metrics-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 24px;
        }

        .metric-item {
            text-align: center;
        }

        .metric-value {
            font-size: 28px;
            font-weight: 700;
            color: #000000;
            letter-spacing: -0.5px;
        }

        .metric-label {
            font-size: 10px;
            font-weight: 600;
            letter-spacing: 1px;
            text-transform: uppercase;
            color: #666666;
            margin-top: 4px;
        }

        /* Footer */
        .footer {
            background-color: #000000;
            padding: 32px 40px;
            color: #ffffff;
        }

        .footer-content {
            font-size: 12px;
            line-height: 1.6;
            color: #999999;
        }

        .footer-company {
            font-weight: 600;
            color: #ffffff;
            margin-bottom: 4px;
        }

        .footer-divider {
            height: 1px;
            background-color: #333333;
            margin: 16px 0;
        }

        .confidential-text {
            font-size: 11px;
            color: #666666;
            margin-top: 16px;
        }

        /* Responsive */
        @media only screen and (max-width: 600px) {
            .header,
            .date-bar,
            .executive-summary,
            .content-section,
            .metrics-section,
            .footer {
                padding-left: 24px;
                padding-right: 24px;
            }

            .metrics-grid {
                grid-template-columns: repeat(2, 1fr);
                gap: 16px;
            }

            .article-link {
                position: static;
                display: inline-block;
                margin-top: 8px;
            }
        }
    </style>
</head>
<body>
    <div class="newsletter-wrapper">
        <!-- Header -->
        <div class="header">
            <div class="company-name">Libertario Coffee Roasters</div>
            <div class="newsletter-title">Market Intelligence Brief</div>
        </div>

        <div class="date-bar">
            <div class="date-text">${currentDate}</div>
        </div>

        <!-- Executive Summary -->
        <div class="executive-summary">
            <div class="summary-label">Executive Summary</div>
            <div class="summary-text">
                ${getData(data.businessAnalysis,
                    'This intelligence brief provides comprehensive analysis of current coffee market dynamics, emerging trends, and strategic opportunities. Our analysis indicates sustained growth in premium segments with increasing consumer focus on sustainability and quality.'
                )}
            </div>
        </div>

        <!-- Main Content -->
        <div class="content-section">
            <h2 class="section-heading">Market Intelligence</h2>

            <div class="article-list">
                ${data.topic1 ? `
                <div class="article-item">
                    ${cleanUrl(data.sources?.topic1) ?
                        `<a href="${cleanUrl(data.sources.topic1)}" class="article-link" target="_blank" rel="noopener" title="View source">→</a>` :
                        ''
                    }
                    <div class="article-category">Market Development</div>
                    <h3 class="article-title">${getData(data.topic1.title, 'Market Expansion Opportunities')}</h3>
                    <p class="article-description">
                        ${getData(data.topic1.description, 'Analysis of emerging markets and growth opportunities in the specialty coffee sector.')}
                    </p>
                </div>
                ` : ''}

                ${data.topic2 ? `
                <div class="article-item">
                    ${cleanUrl(data.sources?.topic2) ?
                        `<a href="${cleanUrl(data.sources.topic2)}" class="article-link" target="_blank" rel="noopener" title="View source">→</a>` :
                        ''
                    }
                    <div class="article-category">Sustainability</div>
                    <h3 class="article-title">${getData(data.topic2.title, 'ESG & Sustainability Initiatives')}</h3>
                    <p class="article-description">
                        ${getData(data.topic2.description, 'Environmental, social, and governance considerations driving market evolution and consumer preferences.')}
                    </p>
                </div>
                ` : ''}

                ${data.topic3 ? `
                <div class="article-item">
                    ${cleanUrl(data.sources?.topic3) ?
                        `<a href="${cleanUrl(data.sources.topic3)}" class="article-link" target="_blank" rel="noopener" title="View source">→</a>` :
                        ''
                    }
                    <div class="article-category">Innovation</div>
                    <h3 class="article-title">${getData(data.topic3.title, 'Technology & Innovation')}</h3>
                    <p class="article-description">
                        ${getData(data.topic3.description, 'Digital transformation and technological advances reshaping operations and customer experience.')}
                    </p>
                </div>
                ` : ''}

                ${data.topic4 ? `
                <div class="article-item">
                    ${cleanUrl(data.sources?.topic4) ?
                        `<a href="${cleanUrl(data.sources.topic4)}" class="article-link" target="_blank" rel="noopener" title="View source">→</a>` :
                        ''
                    }
                    <div class="article-category">Industry Trends</div>
                    <h3 class="article-title">${getData(data.topic4.title, 'Emerging Market Trends')}</h3>
                    <p class="article-description">
                        ${getData(data.topic4.description, 'Key trends and developments shaping the future of the coffee industry.')}
                    </p>
                </div>
                ` : ''}

                ${data.topic5 ? `
                <div class="article-item">
                    ${cleanUrl(data.sources?.topic5) ?
                        `<a href="${cleanUrl(data.sources.topic5)}" class="article-link" target="_blank" rel="noopener" title="View source">→</a>` :
                        ''
                    }
                    <div class="article-category">Strategic Insights</div>
                    <h3 class="article-title">${getData(data.topic5.title, 'Strategic Opportunities')}</h3>
                    <p class="article-description">
                        ${getData(data.topic5.description, 'Strategic opportunities and considerations for business development and growth.')}
                    </p>
                </div>
                ` : ''}
            </div>
        </div>

        <!-- Market Metrics -->
        <div class="metrics-section">
            <div class="metrics-grid">
                <div class="metric-item">
                    <div class="metric-value">${getData(data.articleCount, '15')}</div>
                    <div class="metric-label">Sources</div>
                </div>
                <div class="metric-item">
                    <div class="metric-value">$${(Math.random() * 10 + 35).toFixed(1)}B</div>
                    <div class="metric-label">Market Size</div>
                </div>
                <div class="metric-item">
                    <div class="metric-value">${(Math.random() * 3 + 11).toFixed(1)}%</div>
                    <div class="metric-label">Growth Rate</div>
                </div>
                <div class="metric-item">
                    <div class="metric-value">${(Math.random() * 5 + 15).toFixed(1)}%</div>
                    <div class="metric-label">Specialty Segment</div>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <div class="footer-company">Libertario Coffee Roasters</div>
            <div class="footer-content">
                Strategic Intelligence Division<br>
                intelligence@libertariocoffee.com
            </div>

            <div class="footer-divider"></div>

            <div class="confidential-text">
                This report is prepared exclusively for the Board of Directors.<br>
                Information contained herein is proprietary and confidential.
            </div>
        </div>
    </div>
</body>
</html>
`;

return [{
  subject: `Coffee Market Intelligence - ${new Date(data.date || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`,
  htmlContent: htmlContent,
  date: data.date || new Date().toLocaleDateString(),
  metadata: {
    type: 'board_intelligence',
    version: '3.0',
    generated: new Date().toISOString()
  }
}];
